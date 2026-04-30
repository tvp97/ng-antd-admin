package vn.movie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import vn.movie.dto.CreateUserDto;
import vn.movie.dto.TableDataInfo;
import vn.movie.dto.UpdateUserDto;
import vn.movie.dto.UserDetailDto;
import vn.movie.entity.SysRolePerm;
import vn.movie.entity.SysUserRole;
import vn.movie.entity.User;
import vn.movie.repository.SysRolePermRepository;
import vn.movie.repository.SysUserRoleRepository;
import vn.movie.repository.UserRepository;
import vn.movie.security.PermissionCacheService;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SysUserRoleRepository sysUserRoleRepository;

    @Autowired
    private SysRolePermRepository sysRolePermRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PermissionCacheService permissionCacheService;

    @Transactional
    public void create(CreateUserDto data) {
        User user = new User();
        user.setUserName(data.getUserName());
        user.setPassword(passwordEncoder.encode(data.getPassword()));
        user.setEmail(data.getEmail());
        user.setAvailable(data.getAvailable());
        user.setSex(data.getSex());
        user.setMobile(data.getMobile());
        user.setTelephone(data.getTelephone());
        user.setDepartmentId(data.getDepartmentId());

        User savedUser = userRepository.save(user);

        if (data.getRoleId() != null && !data.getRoleId().isEmpty()) {
            for (Integer rId : data.getRoleId()) {
                SysUserRole sysUserRole = new SysUserRole();
                sysUserRole.setUserId(savedUser.getId());
                sysUserRole.setRoleId(rId);
                sysUserRoleRepository.save(sysUserRole);
            }
        }
    }

    public TableDataInfo<User> findAll(String userName, Integer departmentId, String mobile, int pageIndex, int pageSize) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.hasText(userName)) {
                predicates.add(cb.like(cb.lower(root.get("userName")), "%" + userName.toLowerCase() + "%"));
            }
            if (departmentId != null) {
                predicates.add(cb.equal(root.get("departmentId"), departmentId));
            }
            if (StringUtils.hasText(mobile)) {
                predicates.add(cb.like(root.get("mobile"), "%" + mobile + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<User> page = userRepository.findAll(spec, PageRequest.of(pageIndex - 1, pageSize));
        return TableDataInfo.result(page.getContent(), pageSize, pageIndex, page.getTotalElements());
    }

    public UserDetailDto findOne(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        List<Integer> roleIds = getRolesByUserId(id);
        return UserDetailDto.fromUser(user, roleIds);
    }

    public List<Integer> getRolesByUserId(Integer userId) {
        return sysUserRoleRepository.findByUserId(userId).stream()
                .map(SysUserRole::getRoleId)
                .collect(Collectors.toList());
    }

    public List<String> findOneAuthCode(Integer id) {
        List<Integer> roleIds = getRolesByUserId(id);
        if (roleIds.isEmpty()) return new ArrayList<>();

        List<SysRolePerm> perms = sysRolePermRepository.findByRoleIdIn(roleIds);
        List<String> authCodes = perms.stream()
                .map(SysRolePerm::getPermCode)
                .distinct()
                .collect(Collectors.toList());
        // Cache AUTH_CODE giống nest-api: cacheManager.set(ConfigEnum.AUTH_CODE, autoCodeArray, 0)
        permissionCacheService.cacheAuthCodes(authCodes);
        return authCodes;
    }

    @Transactional
    public void update(UpdateUserDto data) {
        User user = userRepository.findById(data.getId()).orElse(null);
        if (user != null) {
            if (data.getUserName() != null) user.setUserName(data.getUserName());
            if (data.getPassword() != null) user.setPassword(passwordEncoder.encode(data.getPassword()));
            if (data.getEmail() != null) user.setEmail(data.getEmail());
            if (data.getMobile() != null) user.setMobile(data.getMobile());
            if (data.getTelephone() != null) user.setTelephone(data.getTelephone());
            if (data.getAvailable() != null) user.setAvailable(data.getAvailable());
            if (data.getSex() != null) user.setSex(data.getSex());
            if (data.getDepartmentId() != null) user.setDepartmentId(data.getDepartmentId());

            userRepository.save(user);

            sysUserRoleRepository.deleteByUserId(user.getId());
            if (data.getRoleId() != null) {
                for (Integer rId : data.getRoleId()) {
                    SysUserRole role = new SysUserRole();
                    role.setUserId(user.getId());
                    role.setRoleId(rId);
                    sysUserRoleRepository.save(role);
                }
            }
        }
    }

    @Transactional
    public void changePsd(Integer id, String newPassword, String oldPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void remove(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return;
        userRepository.deleteAll(userRepository.findAllById(ids));
        sysUserRoleRepository.deleteByUserIdIn(ids);
    }
}
