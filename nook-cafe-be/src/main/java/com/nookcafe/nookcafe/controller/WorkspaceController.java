package com.nookcafe.nookcafe.controller;

import com.nookcafe.nookcafe.dto.ErrorResponse;
import com.nookcafe.nookcafe.dto.WorkspaceResponse;
import com.nookcafe.nookcafe.model.WorkspaceStatus;
import com.nookcafe.nookcafe.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Rooms", description = "Endpoints for browsing meeting rooms/workspaces")
@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @Operation(summary = "Get all workspaces with optional filters", description = "Public endpoint to list rooms with filters. If 'all' parameter is true, returns rooms of all statuses; otherwise, returns only AVAILABLE rooms by default, unless a specific status is provided.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of rooms")
    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> getWorkspaces(
            @RequestParam(value = "status", required = false) WorkspaceStatus status,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "capacityMin", required = false) Short capacityMin,
            @RequestParam(value = "capacityMax", required = false) Short capacityMax,
            @RequestParam(value = "all", defaultValue = "false") boolean all) {
        
        WorkspaceStatus filterStatus = status;
        if (filterStatus == null && !all) {
            filterStatus = WorkspaceStatus.AVAILABLE;
        }
        
        return ResponseEntity.ok(workspaceService.searchWorkspaces(filterStatus, search, capacityMin, capacityMax));
    }

    @Operation(summary = "Get workspace details by ID", description = "Public endpoint to fetch a single room's details.")
    @ApiResponse(responseCode = "200", description = "Room details retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Room not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponse> getWorkspaceById(@PathVariable Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(id));
    }

    @Operation(summary = "Update workspace status", description = "Staff-only endpoint to toggle room availability (AVAILABLE, MAINTENANCE, INACTIVE).")
    @ApiResponse(responseCode = "200", description = "Status updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid status value", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Room not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping("/{id}/status")
    public ResponseEntity<WorkspaceResponse> updateWorkspaceStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        WorkspaceStatus status = WorkspaceStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(workspaceService.updateWorkspaceStatus(id, status));
    }

    @Operation(summary = "Update workspace image URL", description = "Staff-only endpoint to set/update a room's photo download URL (usually from Firebase Storage).")
    @ApiResponse(responseCode = "200", description = "Image URL updated successfully")
    @ApiResponse(responseCode = "404", description = "Room not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping("/{id}/image")
    public ResponseEntity<WorkspaceResponse> updateWorkspaceImageUrl(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        return ResponseEntity.ok(workspaceService.updateWorkspaceImageUrl(id, imageUrl));
    }

    @Operation(summary = "Update workspace details", description = "Staff-only endpoint to update room details (name, description, capacities, price per hour).")
    @ApiResponse(responseCode = "200", description = "Room updated successfully")
    @ApiResponse(responseCode = "404", description = "Room not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping("/{id}")
    public ResponseEntity<WorkspaceResponse> updateWorkspace(
            @PathVariable Long id,
            @RequestBody WorkspaceResponse updatedWorkspace) {
        return ResponseEntity.ok(workspaceService.updateWorkspace(id, updatedWorkspace));
    }
}
