package vn.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Cấu trúc response chuẩn bọc toàn bộ API, tương ứng với ResultData trong nest-api.
 * Tất cả controller đều trả về dạng {code, msg, data}.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultData<T> {
    private int code;
    private String msg;
    private T data;

    public static <T> ResultData<T> success(T data) {
        return new ResultData<>(200, "SUCCESS", data);
    }

    public static <T> ResultData<T> success(T data, String msg) {
        return new ResultData<>(200, msg, data);
    }

    public static <T> ResultData<T> fail(T data) {
        return new ResultData<>(400, "FAIL", data);
    }

    public static <T> ResultData<T> fail(int code, T data, String message) {
        return new ResultData<>(code, message, data);
    }
}
