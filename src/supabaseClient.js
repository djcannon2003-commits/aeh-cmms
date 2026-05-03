import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rzkgicamasykpgmnitam.supabase.co'
const supabaseKey = 'sb_publishable_HwScmCo38EmNawee74AWqQ_TwnuGgru'

export const supabase = createClient(supabaseUrl, supabaseKey)