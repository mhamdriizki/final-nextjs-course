import { PrismaClient, Role, TaskStatus, Priority } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean up existing data
  await prisma.attachment.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.project.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()

  // Users — passwords are managed by Better Auth; seed plain user records
  // Demo password for all: Demo1234!
  // Better Auth will hash these via its own sign-up flow.
  // For seeding we insert the Account row with a bcrypt hash.
  const { hashSync } = await import('bcryptjs')
  const passwordHash = hashSync('Demo1234!', 10)

  const admin = await prisma.user.create({
    data: {
      id: 'seed-user-admin',
      name: 'Admin User',
      email: 'admin@demo.test',
      emailVerified: true,
      role: Role.ADMIN,
      accounts: {
        create: {
          id: 'seed-account-admin',
          accountId: 'seed-user-admin',
          providerId: 'credential',
          password: passwordHash,
        },
      },
    },
  })

  const alice = await prisma.user.create({
    data: {
      id: 'seed-user-alice',
      name: 'Alice Johnson',
      email: 'alice@demo.test',
      emailVerified: true,
      role: Role.MEMBER,
      accounts: {
        create: {
          id: 'seed-account-alice',
          accountId: 'seed-user-alice',
          providerId: 'credential',
          password: passwordHash,
        },
      },
    },
  })

  const bob = await prisma.user.create({
    data: {
      id: 'seed-user-bob',
      name: 'Bob Martinez',
      email: 'bob@demo.test',
      emailVerified: true,
      role: Role.MEMBER,
      accounts: {
        create: {
          id: 'seed-account-bob',
          accountId: 'seed-user-bob',
          providerId: 'credential',
          password: passwordHash,
        },
      },
    },
  })

  // Projects
  const projectAlpha = await prisma.project.create({
    data: {
      id: 'seed-project-alpha',
      name: 'Website Redesign',
      description: 'Revamp the company marketing site with a modern design system.',
      color: '#6366f1',
      ownerId: admin.id,
      members: {
        create: [
          { id: 'seed-mem-alpha-admin', userId: admin.id },
          { id: 'seed-mem-alpha-alice', userId: alice.id },
          { id: 'seed-mem-alpha-bob', userId: bob.id },
        ],
      },
    },
  })

  const projectBeta = await prisma.project.create({
    data: {
      id: 'seed-project-beta',
      name: 'Mobile App MVP',
      description: 'Build the first version of the iOS and Android app.',
      color: '#f59e0b',
      ownerId: alice.id,
      members: {
        create: [
          { id: 'seed-mem-beta-alice', userId: alice.id },
          { id: 'seed-mem-beta-admin', userId: admin.id },
        ],
      },
    },
  })

  const projectGamma = await prisma.project.create({
    data: {
      id: 'seed-project-gamma',
      name: 'API Integration',
      description: 'Integrate third-party payment and analytics APIs.',
      color: '#10b981',
      ownerId: bob.id,
      members: {
        create: [
          { id: 'seed-mem-gamma-bob', userId: bob.id },
          { id: 'seed-mem-gamma-alice', userId: alice.id },
        ],
      },
    },
  })

  // Tasks — Website Redesign
  const task1 = await prisma.task.create({
    data: {
      title: 'Define design tokens and color palette',
      description: 'Set up CSS variables for the new brand colors, typography, and spacing.',
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      projectId: projectAlpha.id,
      assigneeId: alice.id,
      dueDate: new Date('2026-06-01'),
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Build reusable component library',
      description: 'Create Button, Input, Card, and Modal components in Storybook.',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      projectId: projectAlpha.id,
      assigneeId: alice.id,
      dueDate: new Date('2026-06-20'),
    },
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Redesign homepage hero section',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      projectId: projectAlpha.id,
      assigneeId: bob.id,
      dueDate: new Date('2026-06-25'),
    },
  })

  await prisma.task.create({
    data: {
      title: 'Write copy for product features page',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      projectId: projectAlpha.id,
      assigneeId: admin.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'SEO audit and meta tag update',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: projectAlpha.id,
      assigneeId: bob.id,
      dueDate: new Date('2026-07-01'),
    },
  })

  // Tasks — Mobile App MVP
  await prisma.task.create({
    data: {
      title: 'Set up React Native project structure',
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      projectId: projectBeta.id,
      assigneeId: alice.id,
      dueDate: new Date('2026-05-15'),
    },
  })

  await prisma.task.create({
    data: {
      title: 'Implement user authentication screens',
      description: 'Login, register, and forgot password flows.',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      projectId: projectBeta.id,
      assigneeId: admin.id,
      dueDate: new Date('2026-06-22'),
    },
  })

  await prisma.task.create({
    data: {
      title: 'Design onboarding flow',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: projectBeta.id,
      assigneeId: alice.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Integrate push notifications',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      projectId: projectBeta.id,
      assigneeId: admin.id,
      dueDate: new Date('2026-07-10'),
    },
  })

  // Tasks — API Integration
  await prisma.task.create({
    data: {
      title: 'Research Stripe payment API',
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      projectId: projectGamma.id,
      assigneeId: bob.id,
      dueDate: new Date('2026-05-20'),
    },
  })

  const task11 = await prisma.task.create({
    data: {
      title: 'Implement payment checkout flow',
      description: 'Handle one-time payments and subscription billing with Stripe.',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      projectId: projectGamma.id,
      assigneeId: bob.id,
      dueDate: new Date('2026-06-30'),
    },
  })

  await prisma.task.create({
    data: {
      title: 'Set up Mixpanel analytics events',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: projectGamma.id,
      assigneeId: alice.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Write webhook handler for Stripe events',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      projectId: projectGamma.id,
      assigneeId: bob.id,
      dueDate: new Date('2026-07-05'),
    },
  })

  await prisma.task.create({
    data: {
      title: 'Add error monitoring with Sentry',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      projectId: projectGamma.id,
      assigneeId: alice.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Document API integration runbook',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      projectId: projectGamma.id,
      assigneeId: alice.id,
    },
  })

  // Comments
  await prisma.comment.createMany({
    data: [
      {
        body: 'Design tokens are finalized — Figma file shared with the team.',
        taskId: task1.id,
        authorId: alice.id,
      },
      {
        body: 'Looks great! Approved for production.',
        taskId: task1.id,
        authorId: admin.id,
      },
      {
        body: 'Button and Input components done. Working on Card next.',
        taskId: task2.id,
        authorId: alice.id,
      },
      {
        body: 'Hero video is taking longer than expected — will update Thursday.',
        taskId: task3.id,
        authorId: bob.id,
      },
      {
        body: 'Stripe sandbox keys are in 1Password under "API Integration".',
        taskId: task11.id,
        authorId: bob.id,
      },
      {
        body: 'Should we support Apple Pay as well?',
        taskId: task11.id,
        authorId: alice.id,
      },
    ],
  })

  // Attachments (placeholder URLs)
  await prisma.attachment.createMany({
    data: [
      {
        url: 'https://utfs.io/f/placeholder-design-tokens.pdf',
        filename: 'design-tokens.pdf',
        taskId: task1.id,
      },
      {
        url: 'https://utfs.io/f/placeholder-component-preview.png',
        filename: 'component-preview.png',
        taskId: task2.id,
      },
      {
        url: 'https://utfs.io/f/placeholder-stripe-docs.pdf',
        filename: 'stripe-integration-notes.pdf',
        taskId: task11.id,
      },
    ],
  })

  console.log('✓ Seed complete')
  console.log(`  Users:       admin@demo.test, alice@demo.test, bob@demo.test (password: Demo1234!)`)
  console.log(`  Projects:    ${[projectAlpha, projectBeta, projectGamma].map((p) => p.name).join(', ')}`)
  console.log(`  Tasks:       15`)
  console.log(`  Comments:    6`)
  console.log(`  Attachments: 3`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
