import { PrismaClient, MediaType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SEED_ARTISTS, ADMIN_EMAIL, ADMIN_PASSWORD, PERFORMER_PASSWORD } from './seed-data'

const db = new PrismaClient()

// ─── helpers ─────────────────────────────────────────────────────────────────

function picsumUrl(seed: string, width = 1200, height = 800) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

function headshotUrl(seed: string) {
  return picsumUrl(seed, 800, 1000)
}

// ─── wipe ─────────────────────────────────────────────────────────────────────

async function wipePerformers() {
  // Delete in dependency order — children before parents
  const [inquiries, media, profiles, users] = await db.$transaction([
    db.castingInquiry.deleteMany({}),
    db.mediaItem.deleteMany({}),
    db.performerProfile.deleteMany({}),
    db.user.deleteMany({ where: { role: 'PERFORMER' } }),
  ])
  console.log(
    `  Wiped ${users.count} performers, ${profiles.count} profiles, ` +
    `${media.count} media items, ${inquiries.count} inquiries`,
  )
}

// ─── seed admin ───────────────────────────────────────────────────────────────

async function seedAdmin() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { email: ADMIN_EMAIL, passwordHash: hash, role: 'ADMIN' },
  })
  console.log(`  Admin  ${admin.email}`)
}

// ─── seed performers ──────────────────────────────────────────────────────────

async function seedPerformers() {
  const hash = await bcrypt.hash(PERFORMER_PASSWORD, 10)

  for (const artist of SEED_ARTISTS) {
    const email = `${artist.slug}@talent.agency`

    const user = await db.user.create({
      data: { email, passwordHash: hash, role: 'PERFORMER' },
    })

    const profile = await db.performerProfile.create({
      data: {
        userId: user.id,
        displayName: artist.displayName,
        category: artist.category,
        location: artist.location,
        bio: artist.bio,
        age: artist.age,
        height: artist.height,
        weight: artist.weight,
        measurements: artist.measurements,
        shoeSize: artist.shoeSize,
        hairColor: artist.hairColor,
        eyeColor: artist.eyeColor,
        headshotUrl: headshotUrl(artist.headshotSeed),
        headshotKey: `seed/headshot/${artist.headshotSeed}`,
        isPublished: true,
        isFeatured: artist.isFeatured ?? false,
      },
    })

    // Portfolio items — in declared order
    for (let i = 0; i < artist.portfolio.length; i++) {
      const item = artist.portfolio[i]

      if (item.type === 'photo') {
        const w = item.width ?? 1200
        const h = item.height ?? 800
        await db.mediaItem.create({
          data: {
            performerProfileId: profile.id,
            url: picsumUrl(item.picsumSeed, w, h),
            key: `seed/photo/${item.picsumSeed}`,
            mimeType: 'image/jpeg',
            type: MediaType.PHOTO,
            caption: item.caption ?? null,
            order: i,
          },
        })
      } else {
        await db.mediaItem.create({
          data: {
            performerProfileId: profile.id,
            url: item.youtubeEmbedUrl,
            key: `seed/video/${artist.slug}-${i}`,
            mimeType: 'video/youtube',
            type: MediaType.VIDEO,
            caption: item.caption ?? null,
            order: i,
          },
        })
      }
    }

    const photoCount = artist.portfolio.filter((m) => m.type === 'photo').length
    const videoCount = artist.portfolio.filter((m) => m.type === 'video').length
    console.log(
      `  ${artist.category.padEnd(10)}  ${artist.displayName.padEnd(22)}` +
      `  ${photoCount}ph ${videoCount}vid  ${artist.location}`,
    )
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nTalent / Agency — seed\n')

  console.log('Wiping performer data…')
  await wipePerformers()

  console.log('\nSeeding admin…')
  await seedAdmin()

  console.log('\nSeeding artists…')
  await seedPerformers()

  const total = await db.performerProfile.count()
  const mediaTotal = await db.mediaItem.count()
  console.log(`\nDone — ${total} performers, ${mediaTotal} media items.\n`)
  console.log(`Admin:     ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  console.log(`Performer: <slug>@talent.agency / ${PERFORMER_PASSWORD}\n`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
