package com.nookcafe.nookcafe.dto;

import com.nookcafe.nookcafe.model.Workspace;
import com.nookcafe.nookcafe.model.WorkspaceStatus;

import java.math.BigDecimal;

public class WorkspaceResponse {
    private Long id;
    private String name;
    private String description;
    private Short capacityMin;
    private Short capacityMax;
    private BigDecimal pricePerHour;
    private WorkspaceStatus status;
    private String imageUrl;

    public WorkspaceResponse() {}

    public WorkspaceResponse(Workspace workspace) {
        this.id = workspace.getId();
        this.name = workspace.getName();
        this.description = workspace.getDescription();
        this.capacityMin = workspace.getCapacityMin();
        this.capacityMax = workspace.getCapacityMax();
        this.pricePerHour = workspace.getPricePerHour();
        this.status = workspace.getStatus();
        this.imageUrl = workspace.getImageUrl();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Short getCapacityMin() { return capacityMin; }
    public void setCapacityMin(Short capacityMin) { this.capacityMin = capacityMin; }

    public Short getCapacityMax() { return capacityMax; }
    public void setCapacityMax(Short capacityMax) { this.capacityMax = capacityMax; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }

    public WorkspaceStatus getStatus() { return status; }
    public void setStatus(WorkspaceStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
