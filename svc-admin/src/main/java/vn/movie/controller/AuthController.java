package vn.movie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.movie.dto.LoginDto;
import vn.movie.dto.ResultData;
import vn.movie.entity.Menu;
import vn.movie.service.AuthService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Đăng nhập - POST /auth/signin
     */
    @PostMapping("/signin")
    public ResultData<String> signIn(@Valid @RequestBody LoginDto loginDto) {
        String token = authService.signIn(loginDto.getUserName(), loginDto.getPassword());
        return ResultData.success(token);
    }

    /**
     * Đăng xuất - POST /auth/signout
     */
    @PostMapping("/signout")
    public ResultData<?> signOut() {
        authService.signOut();
        return ResultData.success(null);
    }

    /**
     * Đăng ký - POST /auth/signup (stub)
     */
    @PostMapping("/signup")
    public ResultData<?> signup(@Valid @RequestBody LoginDto loginDto) {
        // Chức năng đăng ký chưa được implement ở nest-api, giữ nguyên stub
        return ResultData.success(null);
    }

    /**
     * Lấy menu theo auth codes - POST /auth/menu
     */
    @PostMapping("/menu")
    public ResultData<List<Menu>> getMenuByUserAuthCode(@RequestBody List<String> authCodes) {
        List<Menu> data = authService.getMenuByUserAuthCode(authCodes);
        return ResultData.success(data);
    }
}
