package vn.movie.dto;

import lombok.Data;

/**
 * DTO tạo mới Role, tương ứng CreateRoleDto trong nest-api.
 */
@Data
public class CreateRoleDto {
    private String roleName;
    private String roleDesc;
}
