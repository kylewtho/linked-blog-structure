import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { getPostBySlug } from '../../../lib/api'

export default function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug},
    method,
  } = req
  if (method != 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).send(`Method ${method} Not Allowed`)
  }
  const slugParts = (slug as string[]).map(s => path.basename(s))
  const post = getPostBySlug(path.join(...slugParts), ['title', 'excerpt']);
  res.status(200).json(post);
}