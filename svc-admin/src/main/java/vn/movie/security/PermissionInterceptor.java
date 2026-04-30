package vn.movie.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Interceptor kiểm tra Permission trên mỗi request,
 * tương ứng với AuthGuard trong nest-api.
 *
 * Hoạt động:
 * 1. Đọc annotation @Permission trên method của controller.
 * 2. Lấy danh sách authCode đã cache (từ PermissionCacheService).
 * 3. Kiểm tra permission code có nằm trong danh sách không.
 * 4. Nếu không có → trả 403 Forbidden.
 */
@Component
public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    private PermissionCacheService permissionCacheService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Permission permission = handlerMethod.getMethodAnnotation(Permission.class);

        // Nếu không có @Permission annotation thì cho qua (giống nest-api)
        if (permission == null) {
            return true;
        }

        String requiredPermission = permission.value();
        List<String> authCodes = permissionCacheService.getCachedAuthCodes();

        if (authCodes == null || !authCodes.contains(requiredPermission)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":403,\"msg\":\"Insufficient permissions\",\"data\":null}");
            return false;
        }

        return true;
    }
}
