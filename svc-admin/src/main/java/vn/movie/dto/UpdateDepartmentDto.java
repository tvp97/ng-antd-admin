package vn.movie.dto;

import lombok.Data;

@Data
public class UpdateDepartmentDto {
    private Integer id;
    private Integer fatherId;
    private String departmentName;
    private Integer orderNum;
    private Boolean state;
}
