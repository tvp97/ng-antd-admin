package vn.movie.security;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service cache danh sách AUTH_CODE theo user (in-memory),
 * tương ứng với cacheManager.set(ConfigEnum.AUTH_CODE, ...) trong nest-api.
 *
 * Trong nest-api, AUTH_CODE được cache globally (1 user tại 1 thời điểm).
 * Ở đây ta mở rộng hơn: cache theo userId để hỗ trợ multi-user.
 */
@Service
public class PermissionCacheService {

    /**
     * Cache ánh xạ userId → danh sách permCode.
     * Sử dụng ConcurrentHashMap cho thread-safe.
     */
    private final ConcurrentHashMap<Integer, List<String>> authCodeCache = new ConcurrentHashMap<>();

    /**
     * Cache cho single-user mode (giống nest-api global cache).
     */
    private volatile List<String> globalAuthCodes = Collections.emptyList();

    /**
     * Lưu auth codes vào cache (global mode, giống nest-api).
     */
    public void cacheAuthCodes(List<String> authCodes) {
        this.globalAuthCodes = authCodes != null ? new ArrayList<>(authCodes) : Collections.emptyList();
    }

    /**
     * Lấy auth codes từ cache (global mode).
     */
    public List<String> getCachedAuthCodes() {
        return globalAuthCodes;
    }

    /**
     * Xoá cache (tương ứng signOut → cacheManager.del(AUTH_CODE)).
     */
    public void clearCache() {
        this.globalAuthCodes = Collections.emptyList();
        this.authCodeCache.clear();
    }

    /**
     * Cache auth codes cho một userId cụ thể (mở rộng).
     */
    public void cacheAuthCodesByUserId(Integer userId, List<String> authCodes) {
        authCodeCache.put(userId, authCodes != null ? new ArrayList<>(authCodes) : Collections.emptyList());
    }

    /**
     * Lấy auth codes theo userId (mở rộng).
     */
    public List<String> getCachedAuthCodesByUserId(Integer userId) {
        return authCodeCache.getOrDefault(userId, Collections.emptyList());
    }
}
