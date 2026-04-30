package vn.movie.dto;

import lombok.Data;

@Data
public class CreateMenuDto {
    private Integer fatherId;
    private String menuName;
    private String menuType;
    private String alIcon;
    private String icon;
    private String path;
    private String code;
    private Integer orderNum;
    private Boolean status;
    private Boolean newLinkFlag;
    private Boolean visible;
}
