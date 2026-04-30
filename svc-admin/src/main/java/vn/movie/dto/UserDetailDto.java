package vn.movie.dto;

import lombok.Data;
import vn.movie.entity.User;

import java.util.List;

/**
 * Response DTO cho findOne user, kèm mảng roleId giống nest-api.
 */
@Data
public class UserDetailDto {
    private Integer id;
    private String email;
    private String userName;
    private Boolean available;
    private Integer sex;
    private String mobile;
    private String telephone;
    private Integer departmentId;
    private List<Integer> roleId;

    public static UserDetailDto fromUser(User user, List<Integer> roleIds) {
        UserDetailDto dto = new UserDetailDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserName(user.getUserName());
        dto.setAvailable(user.getAvailable());
        dto.setSex(user.getSex());
        dto.setMobile(user.getMobile());
        dto.setTelephone(user.getTelephone());
        dto.setDepartmentId(user.getDepartmentId());
        dto.setRoleId(roleIds);
        return dto;
    }
}
