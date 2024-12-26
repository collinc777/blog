
import { z } from 'zod';

// define a schema for the notifications
export const loremIpsumSchema = z.object({
    title: z.string().describe('Title of the lorem ipsum'),
    content: z.string().describe('Content of the lorem ipsum'),
});
