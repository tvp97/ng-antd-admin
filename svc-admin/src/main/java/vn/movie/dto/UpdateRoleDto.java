package vn.movie.dto;

import lombok.Data;

/**
 * DTO cập nhật Role, tương ứng UpdateRoleDto trong nest-api.
 */
@Data
public class UpdateRoleDto {
    private Integer id;
    private String roleName;
    private String roleDesc;
}
