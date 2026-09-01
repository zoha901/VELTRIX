/**
 * Application Constants for VELTRIX
 * VELTRIX = Vitality + Elevation + Tracking + IX (Intelligent Experience)
 */

export const APP_NAME = 'VELTRIX';
export const APP_TAGLINE = 'Rehabilitation & Care Management Platform';

export const USER_ROLES = {
  PATIENT: 'patient',
  THERAPIST: 'therapist',
};

export const ROUTES = {
  LOGIN: '/login',
  PATIENT: {
    ROOT: '/patient',
    DASHBOARD: '/patient/dashboard',
    EXERCISES: '/patient/exercises',
    PROGRESS: '/patient/progress',
  },
  THERAPIST: {
    ROOT: '/therapist',
    DASHBOARD: '/therapist/dashboard',
    PATIENTS: '/therapist/patients',
    EXERCISES: '/therapist/exercises',
    SESSIONS: '/therapist/sessions',
  },
};
