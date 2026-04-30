package vn.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.movie.entity.SysRolePerm;

import java.util.List;

@Repository
public interface SysRolePermRepository extends JpaRepository<SysRolePerm, Integer> {
    List<SysRolePerm> findByRoleIdIn(List<Integer> roleIds);
}
