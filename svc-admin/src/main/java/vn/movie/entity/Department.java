package vn.movie.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "department")
@Getter
@Setter
public class Department extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "father_id")
    private Integer fatherId;

    @Column(name = "department_name", length = 255)
    private String departmentName;

    @Column(name = "order_num")
    private Integer orderNum;

    @Column(name = "state")
    private Boolean state;
}
