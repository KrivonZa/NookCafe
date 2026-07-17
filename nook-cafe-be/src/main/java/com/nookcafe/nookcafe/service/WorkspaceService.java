package com.nookcafe.nookcafe.service;

import com.nookcafe.nookcafe.dto.WorkspaceResponse;
import com.nookcafe.nookcafe.exception.ResourceNotFoundException;
import com.nookcafe.nookcafe.model.Workspace;
import com.nookcafe.nookcafe.model.WorkspaceStatus;
import com.nookcafe.nookcafe.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getAllWorkspaces() {
        return workspaceRepository.findAll().stream()
                .map(WorkspaceResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getAvailableWorkspaces() {
        return workspaceRepository.findByStatus(WorkspaceStatus.AVAILABLE).stream()
                .map(WorkspaceResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> searchWorkspaces(WorkspaceStatus status, String search, Short capacityMin, Short capacityMax) {
        List<Workspace> workspaces = workspaceRepository.findAll();
        
        return workspaces.stream()
                .filter(w -> status == null || w.getStatus() == status)
                .filter(w -> {
                    if (search == null || search.trim().isEmpty()) {
                        return true;
                    }
                    String term = search.trim().toLowerCase();
                    return (w.getName() != null && w.getName().toLowerCase().contains(term)) ||
                           (w.getDescription() != null && w.getDescription().toLowerCase().contains(term));
                })
                .filter(w -> capacityMin == null || w.getCapacityMax() >= capacityMin)
                .filter(w -> capacityMax == null || w.getCapacityMin() <= capacityMax)
                .map(WorkspaceResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspaceById(Long id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        return new WorkspaceResponse(workspace);
    }

    @Transactional
    public WorkspaceResponse updateWorkspaceStatus(Long id, WorkspaceStatus status) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        workspace.setStatus(status);
        return new WorkspaceResponse(workspaceRepository.save(workspace));
    }

    @Transactional
    public WorkspaceResponse updateWorkspaceImageUrl(Long id, String imageUrl) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        workspace.setImageUrl(imageUrl);
        return new WorkspaceResponse(workspaceRepository.save(workspace));
    }

    @Transactional
    public WorkspaceResponse updateWorkspace(Long id, WorkspaceResponse dto) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        if (dto.getName() != null) workspace.setName(dto.getName());
        if (dto.getDescription() != null) workspace.setDescription(dto.getDescription());
        if (dto.getCapacityMin() != null) workspace.setCapacityMin(dto.getCapacityMin());
        if (dto.getCapacityMax() != null) workspace.setCapacityMax(dto.getCapacityMax());
        if (dto.getPricePerHour() != null) workspace.setPricePerHour(dto.getPricePerHour());
        if (dto.getStatus() != null) workspace.setStatus(dto.getStatus());
        if (dto.getImageUrl() != null) workspace.setImageUrl(dto.getImageUrl());
        return new WorkspaceResponse(workspaceRepository.save(workspace));
    }
}
