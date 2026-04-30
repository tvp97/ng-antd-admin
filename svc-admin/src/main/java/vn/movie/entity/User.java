package vn.movie.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"user\"")
@Getter
@Setter
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "user_name", length = 255, nullable = false)
    private String userName;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "available", nullable = false)
    private Boolean available;

    @Column(name = "sex", nullable = false)
    private Integer sex;

    @Column(name = "mobile", length = 20, nullable = false)
    private String mobile;

    @Column(name = "telephone", length = 20)
    private String telephone;

    @Column(name = "department_id", nullable = false)
    private Integer departmentId;

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;
}
