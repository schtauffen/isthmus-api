/**
 *  Root
 *  ->User
 *    + custom fields
 *  ->Site
 *    + custom fields
 *  ->Page
 *    + custom fields
 *  ->Schema
 *    + custom fields
 *  ->Resource
 *    + custom fields
 *    ->Image (and some other predefined)
 *  ->Widgets
 *  ->Content
 *    + custom fields
 *    ->Article (and some other predefined)
 *    ->User-created
 *
 *  The schemas "group" defines which table it belongs to
 *  Inheritance?
 */
export const ROOT = {
  'SCHEMA_ID': '02ec8c5d-0db0-42d3-99d3-0ae7254a99dc',
  'NAME': 'Root'
}
export const TABLES = {
  'CONTENT': {
    'SCHEMA_ID': '0a62c27c-c059-497d-a7fe-f06cf05a2694',
    'NAME': 'Content'
  },
  'PAGE': {
    'SCHEMA_ID': '430ce3bd-735a-4b9c-b9bd-ba26ccd3383b',
    'NAME': 'Page'
  },
  'RESOURCE': {
    'SCHEMA_ID': 'd05b970d-9483-482e-917f-3671a6107ffe',
    'NAME': 'Resource'
  },
  'SCHEMA': {
    'SCHEMA_ID': '7480028f-1a3a-4d8b-83cd-57cfeb0a7a8a',
    'NAME': 'Schema'
  },
  'SITE': {
    'SCHEMA_ID': '7f953057-3c9c-4d05-93b7-59533f6b9ac7',
    'NAME': 'Site'
  },
  'USER': {
    'SCHEMA_ID': 'fb938741-ee0a-49fd-87c7-f394754e3fac',
    'NAME': 'User'
  },
  'WIDGET': {
    'SCHEMA_ID': '19aa2559-5426-436d-9949-ae5e28f74ea7',
    'NAME': 'Widget'
  }
}
