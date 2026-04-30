package vn.movie.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class CreateUserDto {
    @NotBlank(message = "Username cannot be blank")
    private String userName;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    private String email;
    
    @NotNull(message = "Available status is required")
    private Boolean available;

    @NotNull(message = "Sex is required")
    private Integer sex;

    @NotBlank(message = "Mobile cannot be blank")
    private String mobile;

    private String telephone;

    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    private List<Integer> roleId;
}
