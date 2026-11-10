# InternTrack – Internship Application Tracker
IMS566 Advanced Web Design Development and Content Management – Individual Assignment

**Live site:** https://2025176587-jpg.github.io/2025176587/
**Repository:** https://github.com/2025176587-jpg/2025176587

## Description
A static web application for tracking internship applications, reviewing progress, and browsing partner companies.

## Features
- Login and registration with feedback (simulated, no database); usernames must match exactly, including capitalization. Registered accounts are stored in browser local storage.
- Shared responsive Bootstrap navigation, breadcrumbs, signed-in profile, and footer on authenticated pages.
- Personalized dashboard summary cards with status deep-links, recent-application filtering, interview follow-ups, progress bars, and interactive Chart.js charts.
- User-specific application data with add, search, status/company/year filters, sorting, edit, and delete controls. New accounts start with no applications.
- Searchable company cards and an allowance chart.
- Responsive layouts: one column below 600px, two columns from 600px, and three to four columns from 1024px.

## How to test login
- Username: `NurFatihah`
- Password: `ims566`
- Demo profile name: `NurFatihah`
- Wrong credentials show an error message. You can also create an account on the Register tab (stored in your browser only).

## Design system
The visual system is defined in `css/variables.css` and layered through base, layout, component, page, and responsive stylesheets. It uses a forest-green and gold palette, Manrope typography, Bootstrap 5 components, Bootstrap Icons, a 4/8/12/16/24/32/48px spacing scale, and a 200ms interaction transition. Responsive breakpoints are 600px and 1024px, with a single-column mobile layout and horizontally scrollable application table.

## Structure
```text
index.html                 Login and registration
dashboard.html             Summary, progress, and charts
applications.html          Searchable and editable application list
companies.html             Searchable partner-company directory
css/
	variables.css            Design tokens
	base.css                 Reset and typography
	layout.css               Shared portal shell and page layout
	components.css           Reusable controls and components
	pages.css                Page-specific composition
	responsive.css           Breakpoints and motion preferences
js/
	app.js                   Demo data, authentication, and page behavior
README.md
```

## Assumptions and limitations
- Application dates represent submission dates. The sample data has no interview appointments or deadline fields, so no calendar dates are inferred.
- Application additions, edits, and deletions persist in browser local storage separately for each account. New accounts start empty; the demo account retains its bundled sample applications until changed.
- Authentication uses hardcoded demo credentials and browser storage; it is not suitable for production accounts or sensitive data. A real deployment needs server-side authentication, password hashing, and protected sessions.
- External font, Bootstrap, Bootstrap Icons, and Chart.js assets are loaded from CDNs.

## Deploy
Push to GitHub → Settings → Pages → Deploy from branch `main` / root.
