// Dashboard functionality
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  checkAuthentication();

  // Initialize dashboard components
  initializeSearch();
  initializeFilters();
  initializeTable();

  // Set current user info
  setUserInfo();
});

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "login.html";
    return;
  }
}

function setUserInfo() {
  const userEmail = localStorage.getItem("userEmail");
  if (userEmail) {
    // Update user display if needed
    console.log("User logged in:", userEmail);
  }
}

function initializeSearch() {
  const searchInputs = document.querySelectorAll(
    ".search-input, .material-search-input",
  );

  searchInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      filterTableRows(searchTerm);
    });

    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch(e.target.value);
      }
    });
  });

  // Search button functionality
  const searchButtons = document.querySelectorAll(".search-button");
  searchButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const searchInput = this.parentElement.querySelector(".search-input");
      if (searchInput) {
        performSearch(searchInput.value);
      }
    });
  });
}

function performSearch(searchTerm) {
  console.log("Performing search for:", searchTerm);
  filterTableRows(searchTerm.toLowerCase());
}

function filterTableRows(searchTerm) {
  const tableRows = document.querySelectorAll(".table-row");
  let visibleCount = 0;

  tableRows.forEach((row) => {
    const cells = row.querySelectorAll(".table-cell");
    let rowText = "";

    cells.forEach((cell) => {
      rowText += cell.textContent.toLowerCase() + " ";
    });

    if (rowText.includes(searchTerm) || searchTerm === "") {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });

  // Update records count
  updateRecordsCount(visibleCount);
}

function updateRecordsCount(count) {
  const recordsElement = document.querySelector(".records-count");
  if (recordsElement) {
    recordsElement.textContent = `${count} records found`;
  }
}

function initializeFilters() {
  // Date filter functionality
  const dateFilters = document.querySelectorAll(".date-filter, .date-picker");
  dateFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Simulate date picker opening
      console.log("Date filter clicked");
      // In a real implementation, you would open a date picker here
    });
  });

  // Dropdown filter functionality
  const dropdownFilters = document.querySelectorAll(".filter-dropdown");
  dropdownFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      console.log("Filter dropdown clicked");
      // In a real implementation, you would show filter options here
    });
  });
}

function initializeTable() {
  // Table sorting functionality
  const headerCells = document.querySelectorAll(".table-header-cell");
  headerCells.forEach((header, index) => {
    header.style.cursor = "pointer";
    header.addEventListener("click", function () {
      sortTable(index);
    });
  });

  // Table row click functionality
  const tableRows = document.querySelectorAll(".table-row");
  tableRows.forEach((row) => {
    row.addEventListener("click", function () {
      // Remove previous selection
      document.querySelectorAll(".table-row.selected").forEach((r) => {
        r.classList.remove("selected");
      });

      // Add selection to current row
      this.classList.add("selected");

      // Get row data
      const cells = this.querySelectorAll(".table-cell");
      const rowData = Array.from(cells).map((cell) => cell.textContent);
      console.log("Selected row data:", rowData);
    });
  });
}

function sortTable(columnIndex) {
  const table = document.querySelector(".activity-table");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll(".table-row"));

  // Determine sort direction
  const header = document.querySelectorAll(".table-header-cell")[columnIndex];
  const isAscending = !header.classList.contains("sort-desc");

  // Clear previous sort indicators
  document.querySelectorAll(".table-header-cell").forEach((h) => {
    h.classList.remove("sort-asc", "sort-desc");
  });

  // Add sort indicator
  header.classList.add(isAscending ? "sort-asc" : "sort-desc");

  // Sort rows
  rows.sort((a, b) => {
    const aText = a
      .querySelectorAll(".table-cell")
      [columnIndex].textContent.trim();
    const bText = b
      .querySelectorAll(".table-cell")
      [columnIndex].textContent.trim();

    if (isAscending) {
      return aText.localeCompare(bText);
    } else {
      return bText.localeCompare(aText);
    }
  });

  // Reorder rows in DOM
  rows.forEach((row) => tbody.appendChild(row));
}

// Refresh dashboard data
function refreshDashboard() {
  console.log("Refreshing dashboard data...");
  // In a real implementation, you would fetch new data from the server

  // Simulate data refresh
  setTimeout(() => {
    console.log("Dashboard data refreshed");
    // Update charts, table, etc.
  }, 1000);
}

// Export functions for global access
window.refreshDashboard = refreshDashboard;

// Auto-refresh every 5 minutes
setInterval(refreshDashboard, 5 * 60 * 1000);

// Add CSS for table row selection
const style = document.createElement("style");
style.textContent = `
    .table-row {
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .table-row:hover {
        background-color: #f8f9fa;
    }
    
    .table-row.selected {
        background-color: #e3f2fd;
    }
    
    .table-header-cell {
        position: relative;
    }
    
    .table-header-cell.sort-asc::after {
        content: ' ↑';
        color: var(--primary-color);
    }
    
    .table-header-cell.sort-desc::after {
        content: ' ↓';
        color: var(--primary-color);
    }
`;
document.head.appendChild(style);
