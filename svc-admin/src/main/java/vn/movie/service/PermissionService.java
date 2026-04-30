package vn.movie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.movie.dto.AssignRolePermDto;
import vn.movie.entity.SysRolePerm;
import vn.movie.repository.SysRolePermRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    @Autowired
    private SysRolePermRepository sysRolePermRepository;

    /**
     * Gán quyền (permission codes) cho một Role.
     * Xoá tất cả permCode cũ của role rồi insert lại danh sách mới.
     */
    @Transactional
    public void assignRolePermCode(AssignRolePermDto data) {
        // Xoá tất cả quyền cũ của role
        List<SysRolePerm> existing = sysRolePermRepository.findByRoleIdIn(List.of(data.getRoleId()));
        sysRolePermRepository.deleteAll(existing);

        // Insert danh sách quyền mới
        if (data.getPermCodes() != null && !data.getPermCodes().isEmpty()) {
            for (String permCode : data.getPermCodes()) {
                SysRolePerm perm = new SysRolePerm();
                perm.setRoleId(data.getRoleId());
                perm.setPermCode(permCode);
                sysRolePermRepository.save(perm);
            }
        }
    }

    /**
     * Lấy danh sách permission codes mà một Role sở hữu.
     */
    public List<String> getMenusPermissionByRoleId(Integer roleId) {
        List<SysRolePerm> perms = sysRolePermRepository.findByRoleIdIn(List.of(roleId));
        return perms.stream()
                .map(SysRolePerm::getPermCode)
                .collect(Collectors.toList());
    }
}
