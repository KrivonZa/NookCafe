package com.nookcafe.nookcafe.controller;

import com.nookcafe.nookcafe.dto.ErrorResponse;
import com.nookcafe.nookcafe.dto.StaffResponse;
import com.nookcafe.nookcafe.model.Staff;
import com.nookcafe.nookcafe.repository.StaffRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "Endpoints for staff authentication & current user retrieval")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StaffRepository staffRepository;

    public AuthController(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Operation(summary = "Get current authenticated staff user", description = "Retrieves information about the currently logged-in staff member using the authentication context.")
    @ApiResponse(responseCode = "200", description = "Authenticated staff details retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized - no valid credentials provided", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Staff record not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/me")
    public ResponseEntity<StaffResponse> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).build();
        }
        String email = auth.getName();
        Staff staff = staffRepository.findByEmail(email).orElse(null);
        if (staff == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(new StaffResponse(staff));
    }
}
