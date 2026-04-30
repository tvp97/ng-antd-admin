package vn.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableDataInfo<T> {
    private List<T> list;
    private int pageSize;
    private int pageIndex;
    private long total;

    public static <T> TableDataInfo<T> result(List<T> list, int pageSize, int pageIndex, long total) {
        return new TableDataInfo<>(list, pageSize, pageIndex, total);
    }

    /**
     * Trả về toàn bộ list không phân trang (dùng cho Department, Menu).
     * Tương ứng với TableDataInfo.result(list) trong nest-api.
     */
    public static <T> TableDataInfo<T> result(List<T> list) {
        return new TableDataInfo<>(list, 0, 0, list != null ? list.size() : 0);
    }
}
