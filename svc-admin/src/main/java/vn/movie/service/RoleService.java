package vn.movie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.movie.dto.CreateRoleDto;
import vn.movie.dto.FilterParam;
import vn.movie.dto.TableDataInfo;
import vn.movie.dto.UpdateRoleDto;
import vn.movie.entity.Role;
import vn.movie.repository.RoleRepository;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public void create(CreateRoleDto data) {
        Role role = new Role();
        role.setRoleName(data.getRoleName());
        role.setRoleDesc(data.getRoleDesc());
        roleRepository.save(role);
    }

    public TableDataInfo<Role> findAll(FilterParam<CreateRoleDto> searchParam) {
        Specification<Role> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchParam.getFilters() != null) {
                if (StringUtils.hasText(searchParam.getFilters().getRoleName())) {
                    predicates.add(cb.like(cb.lower(root.get("roleName")),
                            "%" + searchParam.getFilters().getRoleName().toLowerCase() + "%"));
                }
                if (StringUtils.hasText(searchParam.getFilters().getRoleDesc())) {
                    predicates.add(cb.like(cb.lower(root.get("roleDesc")),
                            "%" + searchParam.getFilters().getRoleDesc().toLowerCase() + "%"));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        int pageSize = searchParam.getPageSize() > 0 ? searchParam.getPageSize() : 10;
        int pageIndex = searchParam.getPageIndex() > 0 ? searchParam.getPageIndex() : 1;
        Page<Role> page = roleRepository.findAll(spec, PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").ascending()));
        return TableDataInfo.result(page.getContent(), pageSize, pageIndex, page.getTotalElements());
    }

    public Role findOne(Integer id) {
        return roleRepository.findById(id).orElse(null);
    }

    public void update(UpdateRoleDto data) {
        Role role = roleRepository.findById(data.getId()).orElse(null);
        if (role != null) {
            if (data.getRoleName() != null) role.setRoleName(data.getRoleName());
            if (data.getRoleDesc() != null) role.setRoleDesc(data.getRoleDesc());
            roleRepository.save(role);
        }
    }

    public void remove(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return;
        roleRepository.deleteAll(roleRepository.findAllById(ids));
    }
}
