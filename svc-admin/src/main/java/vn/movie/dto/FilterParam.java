package vn.movie.dto;

import lombok.Data;

/**
 * DTO dùng chung cho request body tìm kiếm/phân trang, tương ứng TableSearchFilterDto/FilterParam trong nest-api.
 */
@Data
public class FilterParam<T> {
    private int pageIndex = 1;
    private int pageSize = 10;
    private T filters;
}
