import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gbplhuqupxgxrqttlhwc.supabase.co'
const supabasePublishableKey = 'sb_publishable_W3lz7xkR5VD8Yq2-2Co1yw_B4-v7fgA'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
