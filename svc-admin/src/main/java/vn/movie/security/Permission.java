package vn.movie.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation để đánh dấu quyền cần thiết trên mỗi endpoint,
 * tương ứng với @Permission('...') trong nest-api.
 *
 * Ví dụ: @Permission("default:system:account:add")
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Permission {
    String value();
}
