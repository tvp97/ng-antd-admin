package vn.movie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.movie.dto.*;
import vn.movie.entity.Menu;
import vn.movie.security.Permission;
import vn.movie.service.MenuService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @PostMapping("/create")
    @Permission("default:system:menu:add")
    public ResultData<?> create(@RequestBody CreateMenuDto dto) {
        menuService.create(dto);
        return ResultData.success(null);
    }

    @PostMapping("/list")
    @Permission("default:system:menu")
    public ResultData<TableDataInfo<Menu>> findAll(@RequestBody FilterParam<CreateMenuDto> searchParam) {
        TableDataInfo<Menu> data = menuService.findAll(searchParam);
        return ResultData.success(data);
    }

    @GetMapping("/{id}")
    @Permission("default:system:menu")
    public ResultData<Menu> findOne(@PathVariable Integer id) {
        return ResultData.success(menuService.findOne(id));
    }

    @PutMapping("/update")
    @Permission("default:system:menu:edit")
    public ResultData<?> update(@RequestBody UpdateMenuDto dto) {
        menuService.update(dto);
        return ResultData.success(null);
    }

    @PostMapping("/del")
    @Permission("default:system:menu:del")
    public ResultData<?> remove(@RequestBody Map<String, List<Integer>> body) {
        menuService.remove(body.get("ids"));
        return ResultData.success(null);
    }
}
