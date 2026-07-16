package com.nookcafe.nookcafe.repository;

import com.nookcafe.nookcafe.model.Workspace;
import com.nookcafe.nookcafe.model.WorkspaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByStatus(WorkspaceStatus status);
}
