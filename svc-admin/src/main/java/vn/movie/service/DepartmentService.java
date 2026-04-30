package vn.movie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.movie.dto.CreateDepartmentDto;
import vn.movie.dto.FilterParam;
import vn.movie.dto.TableDataInfo;
import vn.movie.dto.UpdateDepartmentDto;
import vn.movie.entity.Department;
import vn.movie.repository.DepartmentRepository;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public void create(CreateDepartmentDto data) {
        Department dept = new Department();
        dept.setFatherId(data.getFatherId());
        dept.setDepartmentName(data.getDepartmentName());
        dept.setOrderNum(data.getOrderNum());
        dept.setState(data.getState());
        departmentRepository.save(dept);
    }

    public TableDataInfo<Department> findAll(FilterParam<CreateDepartmentDto> searchParam) {
        Specification<Department> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchParam.getFilters() != null) {
                if (StringUtils.hasText(searchParam.getFilters().getDepartmentName())) {
                    predicates.add(cb.like(cb.lower(root.get("departmentName")),
                            "%" + searchParam.getFilters().getDepartmentName().toLowerCase() + "%"));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Department trả toàn bộ list (không phân trang), sort theo orderNum
        List<Department> list = departmentRepository.findAll(spec, Sort.by("orderNum").ascending());
        return TableDataInfo.result(list);
    }

    public Department findOne(Integer id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public void update(UpdateDepartmentDto data) {
        Department dept = departmentRepository.findById(data.getId()).orElse(null);
        if (dept != null) {
            if (data.getFatherId() != null) dept.setFatherId(data.getFatherId());
            if (data.getDepartmentName() != null) dept.setDepartmentName(data.getDepartmentName());
            if (data.getOrderNum() != null) dept.setOrderNum(data.getOrderNum());
            if (data.getState() != null) dept.setState(data.getState());
            departmentRepository.save(dept);
        }
    }

    public void remove(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return;
        departmentRepository.deleteAll(departmentRepository.findAllById(ids));
    }
}
