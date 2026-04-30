package vn.movie.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "menu")
@Getter
@Setter
public class Menu extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "father_id", nullable = false)
    private Integer fatherId;

    @Column(name = "menu_name", length = 255, nullable = false)
    private String menuName;

    @Column(name = "menu_type", length = 100, nullable = false)
    private String menuType;

    @Column(name = "al_icon", length = 255)
    private String alIcon;

    @Column(name = "icon", length = 255)
    private String icon;

    @Column(name = "path", length = 255)
    private String path;

    @Column(name = "code", length = 100, nullable = false)
    private String code;

    @Column(name = "order_num", nullable = false)
    private Integer orderNum;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "new_link_flag")
    private Boolean newLinkFlag;

    @Column(name = "visible")
    private Boolean visible;
}
