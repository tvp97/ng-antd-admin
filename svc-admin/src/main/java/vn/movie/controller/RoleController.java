package vn.movie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.movie.dto.*;
import vn.movie.entity.Role;
import vn.movie.security.Permission;
import vn.movie.service.RoleService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/create")
    @Permission("default:system:role-manager:add")
    public ResultData<?> create(@RequestBody CreateRoleDto dto) {
        roleService.create(dto);
        return ResultData.success(null);
    }

    @PostMapping("/list")
    @Permission("default:system:role-manager")
    public ResultData<TableDataInfo<Role>> findAll(@RequestBody FilterParam<CreateRoleDto> searchParam) {
        TableDataInfo<Role> data = roleService.findAll(searchParam);
        return ResultData.success(data);
    }

    @GetMapping("/{id}")
    @Permission("default:system:role-manager")
    public ResultData<Role> findOne(@PathVariable Integer id) {
        return ResultData.success(roleService.findOne(id));
    }

    @PutMapping("/update")
    @Permission("default:system:role-manager:edit")
    public ResultData<?> update(@RequestBody UpdateRoleDto dto) {
        roleService.update(dto);
        return ResultData.success(null);
    }

    @PostMapping("/del")
    @Permission("default:system:role-manager:del")
    public ResultData<?> remove(@RequestBody Map<String, List<Integer>> body) {
        roleService.remove(body.get("ids"));
        return ResultData.success(null);
    }
}
