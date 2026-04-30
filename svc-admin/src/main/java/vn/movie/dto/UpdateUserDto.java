package vn.movie.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO cập nhật User. Giống Partial<CreateUserDto> + id trong nest-api,
 * tất cả trường đều optional (trừ id).
 */
@Data
public class UpdateUserDto {
    @NotNull(message = "User ID is required")
    private Integer id;

    private String userName;
    private String password;
    private String email;
    private String mobile;
    private String telephone;
    private Boolean available;
    private Integer sex;
    private Integer departmentId;

    private List<Integer> roleId;
}
