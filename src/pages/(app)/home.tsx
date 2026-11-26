
import { useState, type FormEvent } from 'react'
import { useAuthProfileReady, useQuery, useMutations } from 'deepspace'
import { APP_NAME } from '../../constants'

type Experiment = {
  title: string
  description?: string
  robot?: string
  simulator?: string
  status: string
  hypothesis?: string
  ownerId?: string
}

export default function HomePage() {
  const { user } = useAuthProfileReady({ requireUser: true })

  const { records, status: queryStatus, error: queryError } =
    useQuery<Experiment>('experiments', {
      orderBy: 'createdAt',
      orderDir: 'desc',
      limit: 30,
    })

  const { createConfirmed, ready } =
    useMutations<Experiment>('experiments')

  const [title, setTitle] = useState('')
  const [robot, setRobot] = useState('Unitree Go2')
  const [simulator, setSimulator] = useState('NVIDIA Isaac Sim')
  const [description, setDescription] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [experimentStatus, setExperimentStatus] = useState('Planning')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!title.trim()) {
      setError('Please enter an experiment title.')
      return
    }

    if (!ready) {
      setError('The database is not ready yet. Please try again.')
      return
    }

    setSaving(true)

    try {
      await createConfirmed({
        title: title.trim(),
        robot,
        simulator,
        description: description.trim(),
        hypothesis: hypothesis.trim(),
        status: experimentStatus,
      })

      setTitle('')
      setDescription('')
      setHypothesis('')
      setExperimentStatus('Planning')
      setMessage('Experiment saved successfully.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'DeepSpace could not confirm the experiment.'
      )
    } finally {
      setSaving(false)
    }
  }

  const experiments = records ?? []

  const activeCount = experiments.filter(
    (experiment) => experiment.data.status === 'In Progress'
  ).length

  const completedCount = experiments.filter(
    (experiment) => experiment.data.status === 'Completed'
  ).length

  return (
    <main className="min-h-full bg-background px-5 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium tracking-widest text-primary">
              ROBOTICS RESEARCH WORKSPACE
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {APP_NAME}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Design experiments, document hypotheses, and track your robotics research.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome, {user?.name ?? user?.email ?? 'Researcher'}
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Experiments</p>
            <p className="mt-2 text-3xl font-bold">{experiments.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="mt-2 text-3xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-2 text-3xl font-bold">{completedCount}</p>
          </div>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[1fr_1.3fr]">

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">New Experiment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a research experiment and record what you want to investigate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Experiment Title *
                </label>
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Go2 LiDAR Obstacle Detection"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Robot Platform</label>
                <select
                  value={robot}
                  onChange={(event) => setRobot(event.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                >
                  <option>Unitree Go2</option>
                  <option>Unitree G1</option>
                  <option>Custom Robot</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Simulator / Environment</label>
                <select
                  value={simulator}
                  onChange={(event) => setSimulator(event.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                >
                  <option>NVIDIA Isaac Sim</option>
                  <option>ROS 2</option>
                  <option>Gazebo</option>
                  <option>Physical Hardware</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Research Hypothesis</label>
                <textarea
                  value={hypothesis}
                  onChange={(event) => setHypothesis(event.target.value)}
                  placeholder="What do you expect to happen?"
                  rows={3}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Description / Notes</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the experiment and planned approach..."
                  rows={3}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Status</label>
                <select
                  value={experimentStatus}
                  onChange={(event) => setExperimentStatus(event.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                >
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">{error}</p>
              )}
              {message && (
                <p role="status" className="text-sm text-green-500">{message}</p>
              )}

              <button
                type="submit"
                disabled={!ready || saving || !title.trim()}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving Experiment...' : 'Create Experiment'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Research Experiments</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your saved robotics experiments.
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {experiments.length} saved
              </span>
            </div>

            {queryStatus === 'loading' && (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Loading experiments...
              </div>
            )}

            {queryStatus === 'error' && (
              <div role="alert" className="rounded-xl border border-border bg-card p-6 text-sm text-destructive">
                {queryError ?? 'Could not load experiments.'}
              </div>
            )}

            {queryStatus === 'ready' && experiments.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <div className="text-3xl">⚙️</div>
                <h3 className="mt-3 font-semibold">No experiments yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first experiment using the form to start building your research workspace.
                </p>
              </div>
            )}

            {experiments.map((experiment) => (
              <article
                key={experiment.recordId}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{experiment.data.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {experiment.data.robot || 'Robot unspecified'} · {experiment.data.simulator || 'Environment unspecified'}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {experiment.data.status}
                  </span>
                </div>

                {experiment.data.hypothesis && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Hypothesis
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">
                      {experiment.data.hypothesis}
                    </p>
                  </div>
                )}

                {experiment.data.description && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {experiment.data.description}
                  </p>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                  Created {new Date(experiment.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <a
            href="/assistant"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <h3 className="font-semibold">AI Research Assistant ↗</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Open the AI chat workspace to explore research questions and get assistance.
            </p>
          </a>
          <a
            href="/documents"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <h3 className="font-semibold">Research Documents ↗</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Organize research notes and collaborate on technical documents.
            </p>
          </a>
        </section>

        <footer className="border-t border-border pt-5 text-xs text-muted-foreground">
          RoboResearch · A workspace for robotics experimentation and research.
        </footer>
      </div>
    </main>
  )
}
