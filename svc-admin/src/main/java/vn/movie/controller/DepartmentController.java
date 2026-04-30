package vn.movie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.movie.dto.*;
import vn.movie.entity.Department;
import vn.movie.security.Permission;
import vn.movie.service.DepartmentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/department")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping("/create")
    @Permission("default:system:dept:add")
    public ResultData<?> create(@RequestBody CreateDepartmentDto dto) {
        departmentService.create(dto);
        return ResultData.success(null);
    }

    @PostMapping("/list")
    @Permission("default:system:dept")
    public ResultData<TableDataInfo<Department>> findAll(@RequestBody FilterParam<CreateDepartmentDto> searchParam) {
        TableDataInfo<Department> data = departmentService.findAll(searchParam);
        return ResultData.success(data);
    }

    @GetMapping("/{id}")
    @Permission("default:system:dept")
    public ResultData<Department> findOne(@PathVariable Integer id) {
        return ResultData.success(departmentService.findOne(id));
    }

    @PutMapping("/update")
    @Permission("default:system:dept:edit")
    public ResultData<?> update(@RequestBody UpdateDepartmentDto dto) {
        departmentService.update(dto);
        return ResultData.success(null);
    }

    @PostMapping("/del")
    @Permission("default:system:dept:del")
    public ResultData<?> remove(@RequestBody Map<String, List<Integer>> body) {
        departmentService.remove(body.get("ids"));
        return ResultData.success(null);
    }
}
