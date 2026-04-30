package vn.movie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.movie.dto.CreateMenuDto;
import vn.movie.dto.FilterParam;
import vn.movie.dto.TableDataInfo;
import vn.movie.dto.UpdateMenuDto;
import vn.movie.entity.Menu;
import vn.movie.repository.MenuRepository;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    public void create(CreateMenuDto data) {
        Menu menu = new Menu();
        menu.setFatherId(data.getFatherId());
        menu.setMenuName(data.getMenuName());
        menu.setMenuType(data.getMenuType());
        menu.setAlIcon(data.getAlIcon());
        menu.setIcon(data.getIcon());
        menu.setPath(data.getPath());
        menu.setCode(data.getCode());
        menu.setOrderNum(data.getOrderNum());
        menu.setStatus(data.getStatus());
        menu.setNewLinkFlag(data.getNewLinkFlag());
        menu.setVisible(data.getVisible());
        menuRepository.save(menu);
    }

    public TableDataInfo<Menu> findAll(FilterParam<CreateMenuDto> searchParam) {
        Specification<Menu> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchParam.getFilters() != null) {
                if (StringUtils.hasText(searchParam.getFilters().getMenuName())) {
                    predicates.add(cb.like(cb.lower(root.get("menuName")),
                            "%" + searchParam.getFilters().getMenuName().toLowerCase() + "%"));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Menu trả toàn bộ list (không phân trang), sort theo orderNum
        List<Menu> list = menuRepository.findAll(spec, Sort.by("orderNum").ascending());
        return TableDataInfo.result(list);
    }

    public Menu findOne(Integer id) {
        return menuRepository.findById(id).orElse(null);
    }

    public void update(UpdateMenuDto data) {
        Menu menu = menuRepository.findById(data.getId()).orElse(null);
        if (menu != null) {
            if (data.getFatherId() != null) menu.setFatherId(data.getFatherId());
            if (data.getMenuName() != null) menu.setMenuName(data.getMenuName());
            if (data.getMenuType() != null) menu.setMenuType(data.getMenuType());
            if (data.getAlIcon() != null) menu.setAlIcon(data.getAlIcon());
            if (data.getIcon() != null) menu.setIcon(data.getIcon());
            if (data.getPath() != null) menu.setPath(data.getPath());
            if (data.getCode() != null) menu.setCode(data.getCode());
            if (data.getOrderNum() != null) menu.setOrderNum(data.getOrderNum());
            if (data.getStatus() != null) menu.setStatus(data.getStatus());
            if (data.getNewLinkFlag() != null) menu.setNewLinkFlag(data.getNewLinkFlag());
            if (data.getVisible() != null) menu.setVisible(data.getVisible());
            menuRepository.save(menu);
        }
    }

    public void remove(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return;
        menuRepository.deleteAll(menuRepository.findAllById(ids));
    }
}
