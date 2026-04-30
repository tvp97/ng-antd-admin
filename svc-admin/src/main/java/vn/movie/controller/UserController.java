package vn.movie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.movie.dto.*;
import vn.movie.entity.User;
import vn.movie.security.Permission;
import vn.movie.service.UserService;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Tạo user mới - POST /user/create
     */
    @PostMapping("/create")
    @Permission("default:system:account:add")
    public ResultData<?> create(@Valid @RequestBody CreateUserDto dto) {
        userService.create(dto);
        return ResultData.success(null);
    }

    /**
     * Danh sách user (phân trang + filter) - POST /user/list
     */
    @PostMapping("/list")
    @Permission("default:system:account")
    public ResultData<TableDataInfo<User>> findAll(@RequestBody FilterParam<CreateUserDto> searchParam) {
        TableDataInfo<User> data = userService.findAll(
                searchParam.getFilters() != null ? searchParam.getFilters().getUserName() : null,
                searchParam.getFilters() != null ? searchParam.getFilters().getDepartmentId() : null,
                searchParam.getFilters() != null ? searchParam.getFilters().getMobile() : null,
                searchParam.getPageIndex(),
                searchParam.getPageSize()
        );
        return ResultData.success(data);
    }

    /**
     * Chi tiết user theo id - GET /user/:id
     */
    @GetMapping("/{id}")
    @Permission("default:system:account")
    public ResultData<UserDetailDto> findOne(@PathVariable Integer id) {
        return ResultData.success(userService.findOne(id));
    }

    /**
     * Cập nhật user - PUT /user/update
     */
    @PutMapping("/update")
    @Permission("default:system:account:edit")
    public ResultData<?> update(@Valid @RequestBody UpdateUserDto dto) {
        userService.update(dto);
        return ResultData.success(null);
    }

    /**
     * Xoá user(s) - POST /user/del
     */
    @PostMapping("/del")
    @Permission("default:system:account:del")
    public ResultData<?> remove(@RequestBody Map<String, List<Integer>> body) {
        userService.remove(body.get("ids"));
        return ResultData.success(null);
    }

    /**
     * Đổi mật khẩu - PUT /user/psd
     */
    @PutMapping("/psd")
    @Permission("default:system:account:edit")
    public ResultData<?> changePsd(@RequestBody Map<String, Object> req) {
        Integer id = (Integer) req.get("id");
        String newPassword = (String) req.get("newPassword");
        String oldPassword = (String) req.get("oldPassword");
        userService.changePsd(id, newPassword, oldPassword);
        return ResultData.success(null);
    }

    /**
     * Lấy auth code của user - GET /user/auth-code/:id
     */
    @GetMapping("/auth-code/{id}")
    public ResultData<List<String>> findOneAuthCode(@PathVariable Integer id) {
        return ResultData.success(userService.findOneAuthCode(id));
    }
}
