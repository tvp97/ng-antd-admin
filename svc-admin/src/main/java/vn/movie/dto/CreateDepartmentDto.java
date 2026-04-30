package vn.movie.dto;

import lombok.Data;

@Data
public class CreateDepartmentDto {
    private Integer fatherId;
    private String departmentName;
    private Integer orderNum;
    private Boolean state;
}
