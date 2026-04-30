package vn.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.movie.entity.SysUserRole;

import java.util.List;

@Repository
public interface SysUserRoleRepository extends JpaRepository<SysUserRole, Integer> {
    List<SysUserRole> findByUserId(Integer userId);
    void deleteByUserId(Integer userId);
    void deleteByUserIdIn(List<Integer> userIds);
}
