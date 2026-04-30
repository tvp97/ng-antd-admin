package vn.movie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import vn.movie.entity.Menu;
import vn.movie.entity.User;
import vn.movie.repository.MenuRepository;
import vn.movie.repository.UserRepository;
import vn.movie.security.JwtTokenProvider;
import vn.movie.security.PermissionCacheService;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PermissionCacheService permissionCacheService;

    public String signIn(String userName, String password) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại, vui lòng đăng ký"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
        }

        // Fetch User roles mapping to build JWT token claim
        List<Integer> roles = userService.getRolesByUserId(user.getId());

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUserName(), null, new ArrayList<>());
        return jwtTokenProvider.generateToken(authentication, roles, user.getId());
    }

    /**
     * Đăng xuất - xóa cache AUTH_CODE,
     * tương ứng với cacheManager.del(ConfigEnum.AUTH_CODE) trong nest-api.
     */
    public void signOut() {
        permissionCacheService.clearCache();
    }

    public List<Menu> getMenuByUserAuthCode(List<String> authCodes) {
        return menuRepository.findByCodeIn(authCodes);
    }
}
