package vn.movie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.movie.dto.AssignRolePermDto;
import vn.movie.dto.ResultData;
import vn.movie.security.Permission;
import vn.movie.service.PermissionService;

import java.util.List;

@RestController
@RequestMapping("/permission")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    /**
     * Gán quyền cho Role (tương ứng POST /permission/assign-role-menu)
     */
    @PostMapping("/assign-role-menu")
    @Permission("default:system:role-manager:set-role")
    public ResultData<?> assignRoleMenu(@RequestBody AssignRolePermDto dto) {
        permissionService.assignRolePermCode(dto);
        return ResultData.success(null);
    }

    /**
     * Lấy danh sách permCode theo roleId (tương ứng GET /permission/list-role-resources/:roleId)
     */
    @GetMapping("/list-role-resources/{roleId}")
    public ResultData<List<String>> getMenusPermissionByRoleId(@PathVariable Integer roleId) {
        List<String> data = permissionService.getMenusPermissionByRoleId(roleId);
        return ResultData.success(data);
    }
}
