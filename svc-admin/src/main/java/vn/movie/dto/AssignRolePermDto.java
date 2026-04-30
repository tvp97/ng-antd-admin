package vn.movie.dto;

import lombok.Data;

import java.util.List;

/**
 * DTO gán quyền cho Role, tương ứng PermissionAssignRoleMenuReqDto trong nest-api.
 */
@Data
public class AssignRolePermDto {
    private Integer roleId;
    private List<String> permCodes;
}
