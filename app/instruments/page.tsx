import { createClient } from '@/utils/supabase/server'

export default async function InstrumentsPage() {
  const supabase = createClient()
  const { data: instruments, error } = await supabase.from('instruments').select()

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Instruments</h1>
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Instruments</h1>
      <pre className="rounded-md bg-slate-950 p-4 text-sm text-slate-50">
        {JSON.stringify(instruments ?? [], null, 2)}
      </pre>
    </div>
  )
}
