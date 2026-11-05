/* ---------- WORLD OCEAN MAP: THE FIVE OCEANS, LATITUDE AND LONGITUDE (0697 1.3/LO1–LO2; 2027 Mathematical requirements) ----------
   Land: Natural Earth 1:110m land (public domain), equirectangular, simplified, 80° N to 72° S (Antarctica included).
   Skills: name the five oceans (Arctic, Atlantic, Pacific, Indian, Southern) on a world map; latitude and longitude in degrees
   (N/S, E/W); hemispheres; difference in latitude; place a point from coordinates; read latitude in DEGREES AND MINUTES from a
   detail map (2027 syllabus: "recognise and use latitude and longitude on a map (degrees and minutes)"); 8-point direction of a
   tracked migration route; the climate zone (tropical, temperate, polar) of a point from its latitude (1.3). All points sit on
   water, well away from coasts. */
import { rng, pickR, shuffleR, fmt } from "../core.js";

const KEY = "oceanmap";
const LAND = "M108 203L110 203L111 203L112 204L108 204L106 204L104 203L108 203ZM149 202L149 202L149 203L145 204L140 203L140 202L142 202L144 202L145 199L147 199L149 201L149 202ZM0 208L50 208L29 208L45 208L45 208L45 207L48 208L53 207L60 206L61 206L64 206L81 206L88 205L91 207L92 206L97 207L100 207L106 207L107 207L105 206L103 205L102 204L105 204L106 204L112 205L117 204L120 205L121 204L130 205L132 205L133 204L139 206L150 204L151 202L149 200L149 199L150 198L150 197L155 193L158 193L162 191L163 191L164 192L163 192L159 193L157 194L157 195L154 196L153 197L153 198L157 200L158 202L159 205L158 206L149 208L136 208L212 208L217 207L220 206L218 205L219 205L223 204L227 202L230 203L231 201L233 202L236 202L240 202L251 200L253 200L255 201L258 200L260 201L269 200L270 201L279 201L285 198L291 200L293 200L296 198L308 196L310 195L315 195L319 197L322 198L326 197L332 197L333 199L331 201L331 201L332 201L331 203L335 203L340 200L344 200L349 197L357 196L358 195L359 196L361 197L362 196L373 197L377 194L382 196L386 196L392 195L394 196L401 197L403 196L420 195L420 194L421 194L422 196L424 196L431 196L434 196L435 197L435 197L439 198L442 199L446 198L456 201L463 201L468 202L469 203L467 205L462 206L458 208L463 208L453 208L480 208ZM150 179L152 180L154 180L153 181L151 180L149 181L144 180L141 177L145 179L148 177L150 179ZM434 161L435 162L438 161L438 163L437 164L436 165L435 165L433 162L434 161ZM471 161L471 162L472 161L473 162L471 165L471 165L469 166L468 168L466 169L465 169L462 169L463 167L468 164L471 161ZM473 155L474 157L475 156L475 157L477 158L478 157L478 159L477 159L476 161L474 162L473 162L474 161L472 160L473 159L473 157L470 153L473 154L473 155ZM307 125L308 127L307 128L307 127L306 128L307 129L303 140L302 140L301 141L299 140L299 138L298 136L298 135L300 133L299 131L299 129L302 128L305 125L306 123L307 125ZM432 125L432 126L433 126L434 127L434 127L435 132L439 134L440 137L440 136L441 137L441 138L444 141L444 143L445 144L444 149L441 154L440 157L438 157L435 159L433 158L434 157L432 159L428 158L427 156L424 154L425 153L423 154L424 152L424 151L422 153L419 150L415 149L408 150L407 151L406 151L405 152L400 152L398 154L396 154L394 153L394 152L395 151L394 151L395 149L393 145L391 142L392 142L392 141L393 142L391 139L392 138L392 137L392 136L393 137L396 134L397 135L402 133L402 132L403 131L403 130L404 129L405 130L405 129L405 128L406 129L408 126L408 126L410 125L411 127L413 127L413 126L414 125L414 124L414 124L417 123L416 122L421 123L422 123L423 123L421 127L427 131L428 130L429 129L429 127L429 125L430 122L430 121L431 122L432 125ZM385 116L390 116L391 117L393 117L395 118L393 119L388 118L381 116L382 115L385 116ZM443 114L441 115L438 115L438 114L440 114L440 114L441 114L442 112L443 112L443 114ZM419 108L419 111L421 111L422 110L425 109L433 112L435 113L435 114L437 115L436 116L437 117L439 120L440 120L440 120L441 121L440 121L437 120L435 118L433 117L431 118L431 119L430 119L428 119L427 118L424 118L425 117L424 114L422 113L418 112L418 112L416 111L419 110L419 110L417 110L414 108L417 107L419 108ZM407 105L405 107L404 106L400 107L401 109L405 108L402 109L404 111L403 112L404 114L403 114L404 113L402 113L401 112L402 110L401 111L401 114L399 114L400 112L399 111L400 106L401 105L402 106L406 106L407 105L407 105ZM381 115L380 115L375 111L372 104L367 100L367 100L370 100L374 104L376 104L379 107L378 108L379 108L380 110L382 111L381 115ZM397 104L399 106L397 106L396 109L395 112L395 112L393 112L391 111L390 112L389 111L387 111L387 109L386 108L386 105L386 104L387 105L389 103L391 103L396 98L399 100L397 101L397 103L398 104L397 104ZM409 96L409 99L408 97L407 98L408 99L407 99L406 99L405 96L405 97L404 97L403 98L403 97L403 96L405 95L406 96L407 95L408 95L407 94L409 95L409 96ZM349 99L347 99L347 98L347 94L348 95L349 97L349 99ZM402 82L403 83L403 82L404 84L402 86L402 87L403 88L406 89L405 89L406 90L405 90L404 89L404 89L402 89L401 88L402 88L400 87L401 83L401 82L402 82ZM143 80L145 81L146 80L149 82L149 82L149 83L148 82L146 83L145 83L145 83L141 82L144 82L143 81L142 81L143 80ZM134 77L135 77L136 77L137 78L141 80L141 80L137 80L137 80L135 78L131 77L131 77L127 78L131 76L134 77ZM402 77L401 78L400 76L401 74L402 73L403 74L402 77ZM428 57L427 60L423 61L421 62L420 62L420 61L415 62L416 63L414 66L414 65L414 64L413 63L417 60L420 59L421 60L423 57L423 58L426 56L427 52L429 52L429 54L428 57ZM432 48L434 48L434 49L431 51L429 50L428 51L427 51L427 49L429 49L430 46L432 48ZM76 42L73 42L69 40L69 39L73 40L76 42ZM165 39L165 40L169 41L169 42L170 44L168 45L168 43L166 44L167 44L165 43L161 43L162 43L161 42L164 39L166 38L165 39ZM432 39L433 42L431 41L430 43L432 44L432 45L431 45L430 46L429 45L430 41L429 36L430 35L430 35L430 34L432 39ZM231 37L229 38L227 38L228 36L227 35L230 33L233 34L231 37ZM236 29L235 30L236 30L238 30L236 32L237 32L239 34L240 34L241 36L242 37L242 38L242 39L237 40L236 39L233 40L236 38L234 38L233 38L235 37L234 36L236 36L236 35L233 34L234 33L233 33L232 31L234 29L236 29ZM127 19L127 20L131 21L132 22L133 22L130 22L129 21L126 23L124 22L125 22L126 19L127 19ZM221 18L221 19L222 20L217 22L210 22L211 21L208 20L211 20L211 20L208 19L211 18L213 19L221 18ZM0 15L7 17L7 18L11 18L14 19L12 20L10 20L10 21L8 21L5 20L2 20L2 19L2 19L0 19L1 20L0 20L-3 21L0 23L-1 24L-8 25L-12 26L-13 27L-15 26L-18 27L-19 27L-22 27L-24 29L-22 30L-22 32L-24 32L-24 33L-24 34L-26 34L-26 36L-28 36L-29 38L-31 39L-33 33L-31 30L-29 30L-20 24L-22 24L-23 25L-26 26L-27 25L-31 25L-34 27L-33 28L-38 29L-38 28L-40 27L-42 28L-46 28L-50 28L-60 34L-56 35L-53 35L-51 36L-51 37L-55 45L-60 49L-62 50L-63 49L-66 51L-67 53L-70 54L-70 55L-67 57L-68 60L-71 61L-72 58L-71 58L-72 56L-72 57L-73 56L-73 54L-74 54L-78 55L-78 54L-77 53L-78 52L-81 55L-83 55L-80 57L-79 56L-77 57L-76 58L-80 59L-81 60L-79 61L-77 65L-77 66L-78 66L-77 67L-78 69L-80 73L-85 77L-88 77L-88 77L-89 78L-92 78L-92 80L-93 80L-94 79L-93 78L-95 78L-99 81L-97 85L-95 85L-94 89L-94 91L-98 94L-100 95L-100 95L-100 94L-102 93L-103 91L-105 90L-105 89L-106 89L-106 91L-108 94L-106 97L-104 98L-102 100L-102 103L-101 105L-105 103L-106 98L-108 96L-109 97L-108 89L-110 84L-111 85L-114 86L-114 83L-115 81L-115 81L-117 79L-118 77L-119 77L-119 77L-119 78L-124 78L-124 80L-126 81L-131 85L-133 86L-133 93L-136 96L-138 95L-140 87L-142 86L-143 78L-146 79L-148 77L-147 77L-151 73L-163 73L-164 71L-165 71L-167 72L-171 70L-173 67L-174 66L-175 67L-176 67L-175 70L-173 71L-172 74L-172 73L-171 72L-171 75L-168 75L-164 72L-165 74L-163 75L-161 75L-160 78L-162 80L-163 80L-163 82L-164 82L-165 83L-166 83L-167 84L-175 88L-182 90L-183 85L-184 83L-185 81L-188 79L-188 75L-190 75L-193 69L-194 70L-193 68L-195 70L-197 67L-192 76L-191 77L-190 82L-189 83L-187 86L-182 90L-183 91L-181 93L-179 93L-172 91L-172 93L-175 100L-179 104L-182 107L-184 109L-186 110L-188 116L-187 116L-187 119L-186 121L-185 127L-187 129L-190 130L-193 133L-193 136L-192 136L-193 138L-192 139L-196 141L-196 145L-202 151L-205 152L-208 152L-213 153L-215 152L-216 150L-215 149L-219 144L-220 141L-221 136L-223 132L-224 131L-224 128L-221 122L-223 119L-222 118L-224 114L-228 108L-227 107L-227 103L-228 101L-232 101L-233 99L-237 99L-242 101L-248 100L-250 101L-257 97L-258 94L-262 91L-261 91L-263 87L-261 84L-262 81L-261 80L-262 79L-261 77L-262 76L-260 74L-259 72L-253 67L-252 63L-249 61L-248 59L-243 60L-236 58L-231 57L-229 58L-226 57L-226 58L-225 57L-225 58L-226 58L-225 60L-226 61L-225 63L-219 64L-219 65L-216 66L-214 67L-213 64L-212 63L-209 63L-208 64L-202 66L-200 65L-198 65L-197 66L-197 65L-195 66L-193 64L-192 61L-192 59L-192 58L-193 58L-194 59L-203 58L-205 56L-204 55L-205 54L-201 53L-201 52L-198 52L-195 51L-193 51L-189 52L-184 52L-184 50L-191 47L-189 45L-190 45L-188 44L-193 45L-193 46L-191 46L-191 47L-195 48L-196 46L-195 46L-195 45L-199 45L-201 47L-203 50L-201 52L-205 53L-205 52L-207 52L-208 53L-207 53L-208 54L-209 54L-209 53L-210 53L-209 55L-209 55L-208 56L-208 57L-209 56L-209 57L-209 58L-210 58L-211 58L-214 53L-214 51L-220 48L-219 48L-220 47L-221 47L-222 47L-221 46L-222 46L-223 46L-223 48L-220 51L-219 51L-218 51L-219 52L-216 52L-215 53L-215 54L-217 53L-218 54L-217 54L-218 56L-219 56L-218 55L-220 53L-224 51L-226 50L-226 48L-229 48L-229 49L-231 49L-236 49L-236 51L-239 52L-240 53L-240 55L-240 55L-243 58L-248 59L-248 58L-250 57L-252 58L-251 57L-252 56L-252 54L-251 52L-252 50L-250 49L-242 49L-242 48L-241 46L-246 42L-244 42L-242 42L-242 41L-241 41L-238 40L-238 39L-235 38L-233 36L-230 35L-229 36L-228 31L-226 30L-226 31L-225 32L-227 33L-227 34L-225 35L-223 34L-221 35L-216 34L-214 34L-211 33L-212 31L-211 30L-210 30L-208 31L-207 29L-209 29L-209 28L-205 27L-202 28L-201 27L-205 26L-209 27L-211 26L-212 23L-206 20L-208 19L-210 19L-211 21L-216 23L-217 25L-215 27L-216 28L-217 29L-219 32L-220 32L-221 33L-222 33L-226 28L-229 29L-232 29L-233 24L-228 22L-220 17L-214 14L-209 13L-207 12L-202 12L-198 13L-200 13L-198 14L-197 14L-195 15L-191 15L-186 16L-185 18L-186 19L-195 18L-196 18L-193 19L-193 21L-190 22L-191 21L-190 20L-186 21L-187 20L-184 18L-181 19L-180 18L-181 17L-181 16L-182 15L-178 16L-177 17L-179 17L-178 18L-176 18L-176 17L-168 15L-167 15L-168 16L-167 16L-161 15L-160 16L-158 15L-160 14L-159 14L-148 16L-148 15L-149 14L-151 14L-150 14L-151 12L-148 11L-147 10L-143 10L-144 12L-142 16L-145 18L-143 19L-140 17L-140 16L-140 15L-142 14L-141 13L-142 12L-140 11L-140 10L-139 11L-139 12L-138 12L-139 11L-134 10L-131 11L-132 10L-132 9L-124 8L-125 8L-124 7L-112 5L-111 6L-108 5L-105 5L-105 4L-101 3L-98 4L-100 4L-92 5L-88 6L-88 6L-94 8L-90 9L-89 8L-88 9L-88 9L-81 9L-81 9L-75 10L-75 9L-70 9L-65 13L-63 11L-53 12L-54 10L-52 10L-40 11L-36 12L-28 12L-27 13L-27 14L-25 14L-16 14L-14 15L-12 15L-13 14L-12 13L0 15ZM480 15L487 17L487 18L491 18L494 19L492 20L490 20L490 21L488 21L485 20L482 20L482 19L482 19L480 19L481 20L480 20L477 21L480 23L479 24L472 25L468 26L467 27L465 26L462 27L461 27L458 27L456 29L458 30L458 32L456 32L456 33L456 34L454 34L454 36L452 36L451 38L449 39L447 33L449 30L451 30L460 24L458 24L457 25L454 26L453 25L449 25L446 27L447 28L442 29L442 28L440 27L438 28L434 28L430 28L420 34L424 35L427 35L429 36L429 37L425 45L420 49L418 50L417 49L414 51L413 53L410 54L410 55L413 57L412 60L409 61L408 58L409 58L408 56L408 57L407 56L407 54L406 54L402 55L402 54L403 53L402 52L399 55L397 55L400 57L401 56L403 57L404 58L400 59L399 60L401 61L403 65L403 66L402 66L403 67L402 69L400 73L395 77L392 77L392 77L391 78L388 78L388 80L387 80L386 79L387 78L385 78L381 81L383 85L385 85L386 89L386 91L382 94L380 95L380 95L380 94L378 93L377 91L375 90L375 89L374 89L374 91L372 94L374 97L376 98L378 100L378 103L379 105L375 103L374 98L372 96L371 97L372 89L370 84L369 85L366 86L366 83L365 81L365 81L363 79L362 77L361 77L361 77L361 78L356 78L356 80L354 81L349 85L347 86L347 93L344 96L342 95L340 87L338 86L337 78L334 79L332 77L333 77L329 73L317 73L316 71L315 71L313 72L309 70L307 67L306 66L305 67L304 67L305 70L307 71L308 74L308 73L309 72L309 75L312 75L316 72L315 74L317 75L319 75L320 78L318 80L317 80L317 82L316 82L315 83L314 83L313 84L305 88L298 90L297 85L296 83L295 81L292 79L292 75L290 75L287 69L286 70L287 68L285 70L283 67L288 76L289 77L290 82L291 83L293 86L298 90L297 91L299 93L301 93L308 91L308 93L305 100L301 104L298 107L296 109L294 110L292 116L293 116L293 119L294 121L295 127L293 129L290 130L287 133L287 136L288 136L287 138L288 139L284 141L284 145L278 151L275 152L272 152L267 153L265 152L264 150L265 149L261 144L260 141L259 136L257 132L256 131L256 128L259 122L257 119L258 118L256 114L252 108L253 107L253 103L252 101L248 101L247 99L243 99L238 101L232 100L230 101L223 97L222 94L218 91L219 91L217 87L219 84L218 81L219 80L218 79L219 77L218 76L220 74L221 72L227 67L228 63L231 61L232 59L237 60L244 58L249 57L251 58L254 57L254 58L255 57L255 58L254 58L255 60L254 61L255 63L261 64L261 65L264 66L266 67L267 64L268 63L271 63L272 64L278 66L280 65L282 65L283 66L283 65L285 66L287 64L288 61L288 59L288 58L287 58L286 59L277 58L275 56L276 55L275 54L279 53L279 52L282 52L285 51L287 51L291 52L296 52L296 50L289 47L291 45L290 45L292 44L287 45L287 46L289 46L289 47L285 48L284 46L285 46L285 45L281 45L279 47L277 50L279 52L275 53L275 52L273 52L272 53L273 53L272 54L271 54L271 53L270 53L271 55L271 55L272 56L272 57L271 56L271 57L271 58L270 58L269 58L266 53L266 51L260 48L261 48L260 47L259 47L258 47L259 46L258 46L257 46L257 48L260 51L261 51L262 51L261 52L264 52L265 53L265 54L263 53L262 54L263 54L262 56L261 56L262 55L260 53L256 51L254 50L254 48L251 48L251 49L249 49L244 49L244 51L241 52L240 53L240 55L240 55L237 58L232 59L232 58L230 57L228 58L229 57L228 56L228 54L229 52L228 50L230 49L238 49L238 48L239 46L234 42L236 42L238 42L238 41L239 41L242 40L242 39L245 38L247 36L250 35L251 36L252 31L254 30L254 31L255 32L253 33L253 34L255 35L257 34L259 35L264 34L266 34L269 33L268 31L269 30L270 30L272 31L273 29L271 29L271 28L275 27L278 28L279 27L275 26L271 27L269 26L268 23L274 20L272 19L270 19L269 21L264 23L263 25L265 27L264 28L263 29L261 32L260 32L259 33L258 33L254 28L251 29L248 29L247 24L252 22L260 17L266 14L271 13L273 12L278 12L282 13L280 13L282 14L283 14L285 15L289 15L294 16L295 18L294 19L285 18L284 18L287 19L287 21L290 22L289 21L290 20L294 21L293 20L296 18L299 19L300 18L299 17L299 16L298 15L302 16L303 17L301 17L302 18L304 18L304 17L312 15L313 15L312 16L313 16L319 15L320 16L322 15L320 14L321 14L332 16L332 15L331 14L329 14L330 14L329 12L332 11L333 10L337 10L336 12L338 16L335 18L337 19L340 17L340 16L340 15L338 14L339 13L338 12L340 11L340 10L341 11L341 12L342 12L341 11L346 10L349 11L348 10L348 9L356 8L355 8L356 7L368 5L369 6L372 5L375 5L375 4L379 3L382 4L380 4L388 5L392 6L392 6L386 8L390 9L391 8L392 9L392 9L399 9L399 9L405 10L405 9L410 9L415 13L417 11L427 12L426 10L428 10L440 11L444 12L452 12L453 13L453 14L455 14L464 14L466 15L468 15L467 14L468 13L480 15ZM306 52L307 53L306 53L305 56L306 57L308 58L312 58L312 56L312 55L311 55L311 52L312 53L313 52L312 51L311 51L311 52L310 51L311 50L307 48L307 47L309 48L309 47L310 46L311 47L311 45L311 44L307 45L302 47L306 52ZM120 14L120 16L121 15L123 15L122 16L124 17L126 15L126 14L128 14L132 15L131 16L132 17L127 19L126 18L124 21L120 22L116 24L115 26L114 28L116 29L117 31L122 31L127 33L131 33L130 35L131 36L134 39L135 38L135 37L135 35L134 34L138 32L138 31L136 29L137 27L136 24L141 24L142 24L147 26L148 28L150 29L152 29L154 26L158 31L158 32L164 34L164 35L166 36L166 37L158 40L152 40L149 41L145 44L147 44L152 41L154 41L155 42L153 43L154 45L158 46L160 44L160 45L161 46L156 47L153 49L152 49L152 48L154 47L151 47L146 50L146 51L147 51L147 51L142 52L144 52L141 53L142 53L140 55L140 54L140 56L139 57L139 56L138 55L138 56L138 56L139 56L139 60L132 65L132 67L134 71L133 73L131 72L130 70L130 69L128 67L127 67L125 66L124 67L121 66L121 67L121 68L121 68L119 68L118 67L117 68L115 67L111 69L110 70L111 72L110 75L110 78L112 80L112 81L114 83L117 82L119 81L120 79L124 78L123 83L123 82L123 84L122 86L129 86L129 88L128 92L131 95L132 95L134 94L136 94L138 95L139 94L140 92L145 90L145 90L145 92L144 92L145 95L146 94L145 92L147 92L147 91L147 92L149 93L153 93L158 93L157 93L159 94L159 95L160 95L162 98L166 99L166 99L169 99L171 101L173 104L174 105L173 107L175 107L175 109L176 108L180 109L181 110L181 111L182 110L187 111L193 114L194 116L193 120L188 125L188 130L187 131L187 133L186 135L186 136L184 138L181 138L177 140L175 142L176 143L175 145L171 150L169 153L167 154L162 152L165 155L165 156L161 159L157 159L157 162L154 161L153 162L154 163L155 163L155 163L156 164L153 165L153 166L152 167L150 169L151 170L153 170L152 171L151 172L149 174L148 176L149 177L147 177L146 177L146 179L145 179L140 177L140 176L140 175L139 172L141 170L139 169L141 168L141 166L143 166L143 163L142 163L141 165L143 159L142 156L145 150L145 145L146 144L147 133L146 131L139 126L138 125L139 125L137 123L134 117L132 115L132 115L132 113L134 110L134 110L133 110L132 110L133 110L132 108L134 106L133 106L135 105L135 105L135 104L137 102L137 101L137 101L137 99L137 99L136 97L136 96L135 95L133 96L134 97L132 97L132 96L132 97L130 96L130 96L129 96L129 95L127 94L127 93L127 94L127 94L126 93L126 93L126 92L123 90L124 89L124 90L124 89L118 88L115 86L114 85L112 86L106 84L104 83L102 83L99 80L100 80L100 78L98 75L94 72L95 72L91 68L89 65L88 65L87 65L87 67L89 68L89 69L91 71L93 75L94 76L94 76L91 74L91 72L88 71L87 70L88 69L86 68L84 63L79 61L75 55L75 54L74 53L75 52L74 50L75 46L74 42L76 43L77 44L77 44L76 42L73 40L70 39L70 37L68 37L66 35L66 34L64 33L61 29L58 29L52 27L44 26L43 26L42 27L38 28L38 26L40 26L39 25L35 28L36 28L35 29L32 30L29 32L20 34L25 32L26 32L30 30L31 28L28 29L27 28L24 29L24 27L22 27L20 26L20 25L19 25L21 23L25 22L26 22L25 21L26 21L23 21L18 21L16 19L21 18L25 19L24 18L18 16L21 15L26 13L31 12L34 13L37 12L39 13L41 13L47 14L49 13L58 15L59 14L63 14L67 13L69 14L69 13L73 14L74 13L75 14L78 14L87 15L88 16L87 16L89 17L94 16L95 17L97 16L95 16L96 15L105 17L109 17L109 16L110 15L112 16L112 17L113 16L114 16L115 15L112 13L112 12L113 11L115 11L118 13L117 14L120 14ZM88 9L87 10L94 10L96 11L97 11L96 9L98 9L101 11L101 12L106 14L103 14L104 15L104 15L97 15L89 16L88 15L85 15L84 14L85 13L90 13L83 13L82 12L85 12L81 12L83 10L88 9ZM138 9L139 10L134 10L132 9L138 9ZM125 9L126 10L127 9L130 9L133 10L133 11L136 10L141 11L141 12L150 13L151 15L149 15L154 16L156 18L158 18L155 20L151 18L149 19L153 21L154 22L154 23L149 22L152 24L146 23L140 21L140 21L136 21L136 20L142 20L141 19L143 17L142 16L138 15L139 15L137 14L135 13L134 14L127 14L121 13L122 12L120 12L120 11L121 9L122 9L126 9L125 9ZM106 8L111 9L110 10L112 10L111 11L109 12L104 10L104 10L106 10L105 9L106 8ZM116 10L115 11L113 11L112 10L113 8L120 8L118 10L116 10ZM80 12L76 12L72 11L75 9L74 8L78 8L86 9L81 10L80 12ZM434 6L433 7L423 7L425 5L434 6ZM109 5L110 5L109 7L107 7L106 6L104 6L103 5L109 5ZM96 5L99 6L98 7L91 8L88 7L91 7L85 7L83 7L86 5L90 5L92 6L95 6L93 5L94 5L96 5L96 5ZM317 13L312 13L311 12L309 12L309 11L310 11L310 10L313 9L312 9L315 7L314 7L322 5L331 4L332 5L318 8L314 10L314 12L317 13ZM114 4L119 5L119 5L121 6L132 6L134 6L134 7L133 7L131 8L117 7L115 5L111 5L114 4ZM85 3L85 4L84 5L78 6L76 5L79 4L85 3ZM107 2L107 3L101 2L100 1L107 2ZM380 3L373 3L375 1L376 1L381 2L380 3ZM265 1L269 2L264 3L263 5L261 5L259 4L260 3L258 3L254 1L258 0L265 1ZM274 0L277 0L271 1L265 0L263 0L268 -1L274 0ZM374 2L367 2L362 0L365 -1L368 -1L374 1L374 2ZM124 1L126 1L122 3L116 2L115 2L115 1L116 1L112 1L111 0L112 -1L115 -1L123 0L124 1ZM149 -2L158 -2L151 -2L150 -2L153 -2L148 -1L145 1L138 1L140 1L139 2L140 2L136 4L134 4L136 4L136 5L123 5L121 5L121 4L123 4L123 3L123 3L127 4L123 2L127 1L125 1L124 0L129 0L131 0L128 -1L123 0L118 -2L118 -2L149 -2ZM204 -2L212 -2L198 -2L211 -2L209 -1L223 -2L224 -1L214 0L217 0L214 2L214 3L216 4L211 5L214 5L214 7L213 7L214 8L211 8L213 8L213 9L209 9L211 11L207 10L211 12L211 13L209 13L206 12L207 13L205 13L210 13L207 15L198 16L195 18L187 20L186 20L185 22L183 23L184 24L182 27L181 27L179 26L176 26L171 22L171 20L169 19L169 18L168 17L170 16L172 15L172 14L169 15L167 14L167 13L168 12L172 13L166 11L167 10L162 6L159 5L149 6L145 4L151 4L143 3L143 2L153 1L153 1L150 0L157 -2L157 -2L181 -2L178 -2L204 -2Z";
const K = 4 / 3, MX = 40, MY = 10, TOP = 80, BOT = -72, MW = 360 * K, MH = (TOP - BOT) * K, W = 560;
const X = (lon) => MX + (lon + 180) * K, Y = (lat) => MY + (TOP - lat) * K;

/* ---- land test (even-odd over every ring of the land path, in map units) ---- */
const RINGS = LAND.split("M").filter(Boolean).map((r) => { const n = r.replace(/Z/g, "").split(/[ L]/).map(Number); const p = []; for (let i = 0; i + 1 < n.length; i += 2) p.push([n[i], n[i + 1]]); return p; });
function isLand(lat, lon) {
  const x = (lon + 180) * K, y = (TOP - lat) * K; let inside = false;
  for (const ring of RINGS) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
/* open water: the point and a ring of points `m` degrees around it are all sea */
function openWater(lat, lon, m = 4) {
  if (isLand(lat, lon)) return false;
  for (const f of [0.35, 0.7]) for (let a = 0; a < 8; a++) { const t = (a * Math.PI) / 4; let lo = lon + f * m * Math.cos(t); if (lo > 180) lo -= 360; if (lo < -180) lo += 360; if (isLand(lat + f * m * Math.sin(t), lo)) return false; }
  for (let a = 0; a < 8; a++) { const t = (a * Math.PI) / 4, la = lat + m * Math.sin(t); let lo = lon + m * Math.cos(t); if (lo > 180) lo -= 360; if (lo < -180) lo += 360; if (la < BOT || la > TOP || isLand(la, lo)) return false; }
  return true;
}

/* ---- ocean areas: boxes well inside each ocean (no boundary cases), sampled on a grid ---- */
const OCEANS = ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Southern Ocean"];
const BOXES = {
  "Pacific Ocean": [[10, 40, 160, 180], [10, 40, -180, -130], [-40, -10, -160, -100]],
  "Atlantic Ocean": [[20, 40, -60, -30], [-40, -10, -30, -10]],
  "Indian Ocean": [[-30, -10, 60, 100]],
  "Arctic Ocean": [[75, 77, -170, -135], [75, 77, 30, 60]],
  "Southern Ocean": [[-66, -64, -180, 180]],
};
const STEP = { "Pacific Ocean": 10, "Atlantic Ocean": 10, "Indian Ocean": 10, "Arctic Ocean": 5, "Southern Ocean": 10 };
function sampleIn(r, name) {
  for (let k = 0; k < 200; k++) {
    const [a, b, c, d] = pickR(r, BOXES[name]), st = STEP[name];
    const lat = name === "Arctic Ocean" ? 75 + (r() < 0.5 ? 0 : 2) : name === "Southern Ocean" ? -65 : a + Math.floor(r() * ((b - a) / st + 1)) * st;
    const lon = c + Math.floor(r() * ((d - c) / st + 1)) * st;
    if (lon === 0 || Math.abs(lon) === 180) continue;
    if (openWater(lat, lon, name === "Arctic Ocean" ? 2.5 : 4)) return { lat, lon, ocean: name };
  }
  return null;
}

const latS = (v) => (v === 0 ? "0°" : `${Math.abs(v)}° ${v > 0 ? "N" : "S"}`), lonS = (v) => (v === 0 ? "0°" : `${Math.abs(v)}° ${v > 0 ? "E" : "W"}`);
const dm = (v) => { const a = Math.abs(v), d = Math.floor(a + 1e-9), m = Math.round((a - d) * 60); return `${d}° ${String(m).padStart(2, "0")}′`; };
const latDM = (v) => `${dm(v)} ${v >= 0 ? "N" : "S"}`, lonDM = (v) => `${dm(v)} ${v >= 0 ? "E" : "W"}`;
const DIRS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
const LET = "ABCDE";

function make(seed) {
  for (let tries = 0; tries < 400; tries++) {
    const r = rng(seed + tries * 7907 + 3);
    // five lettered points, one in each ocean
    const pts = []; let ok = true;
    for (const o of shuffleR(r, OCEANS)) { const p = sampleIn(r, o); if (!p || pts.some((q) => Math.abs(q.lat - p.lat) + Math.abs(q.lon - p.lon) < 30)) { ok = false; break; } pts.push(p); }
    if (!ok) continue;
    pts.forEach((p, i) => (p.id = LET[i]));
    // hemisphere/side question: a (N/S, E/W) combination held by exactly one point
    const combos = [];
    for (const ns of [1, -1]) for (const ew of [1, -1]) { const m = pts.filter((p) => Math.sign(p.lat) === ns && Math.sign(p.lon) === ew); if (m.length === 1) combos.push({ ns, ew, id: m[0].id }); }
    if (!combos.length) continue;
    const hemi = pickR(r, combos);
    // plot target: open water on the 10° grid, at least 15° from every lettered point
    let target = null;
    for (let k = 0; k < 300 && !target; k++) { const c = { lat: -50 + Math.floor(r() * 11) * 10, lon: -170 + Math.floor(r() * 35) * 10 }; if (c.lon !== 0 && openWater(c.lat, c.lon, 5) && pts.every((p) => Math.abs(p.lat - c.lat) + Math.abs(p.lon - c.lon) >= 20)) target = c; }
    if (!target) continue;
    // detail map (degrees and minutes): a 2° × 2° box of open water; point P on a 30′ intersection that is not a whole degree
    let det = null;
    for (let k = 0; k < 300 && !det; k++) {
      const la0 = -48 + Math.floor(r() * 46) * 2, lo0 = -178 + Math.floor(r() * 177) * 2;
      if (!openWater(la0 + 1, lo0 + 1, 4)) continue;
      const pl = la0 + pickR(r, [0.5, 1.5]), po = lo0 + pickR(r, [0.5, 1, 1.5]);
      if (Math.abs(pl) < 1) continue;
      det = { la0, lo0, p: { lat: pl, lon: po } };
    }
    if (!det) continue;
    // migration route (half the seeds): start → end in one ocean, overall direction within 12° of an 8-point direction
    let route = null;
    if (r() < 0.6) for (let k = 0; k < 400 && !route; k++) {
      const o = pickR(r, ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean"]), s = sampleIn(r, o), e = sampleIn(r, o);
      if (!s || !e) continue; const dx = (e.lon - s.lon) * K, dy = (e.lat - s.lat) * K; if (Math.hypot(dx, dy) < 40 * K) continue;
      const ang = (Math.atan2(dx, dy) * 180) / Math.PI, idx = ((Math.round(ang / 45) % 8) + 8) % 8; if (Math.abs(ang - Math.round(ang / 45) * 45) > 12) continue;
      if (Math.abs(e.lon - s.lon) > 90) continue;
      // two bends, kept on water
      const wp = [s]; let good = true;
      for (const f of [1 / 3, 2 / 3]) { const lat = s.lat + (e.lat - s.lat) * f + (r() - 0.5) * 8, lon = s.lon + (e.lon - s.lon) * f + (r() - 0.5) * 8; if (!openWater(lat, lon, 3)) { good = false; break; } wp.push({ lat, lon }); }
      wp.push(e);
      for (let i = 0; good && i < wp.length - 1; i++) for (let t = 0; t <= 1; t += 0.1) { if (isLand(wp[i].lat + (wp[i + 1].lat - wp[i].lat) * t, wp[i].lon + (wp[i + 1].lon - wp[i].lon) * t)) { good = false; break; } }
      if (good) route = { ocean: o, wp, dir: idx, animal: pickR(r, ["a tagged loggerhead turtle", "a tagged bluefin tuna", "a tagged leatherback turtle", "a tagged blue shark"]) };
    }
    return { kind: KEY, seed, pts, hemi, target, det, route };
  }
  return make(seed + 1);
}

function worldSVG(F, opt) {
  opt = opt || {}; const hl = opt.hl || {};
  let s = `<defs><clipPath id="${KEY}-clip"><rect x="${MX}" y="${MY}" width="${MW}" height="${MH}"/></clipPath><marker id="${KEY}-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" class="omarr"/></marker></defs>`;
  s += `<rect x="${MX}" y="${MY}" width="${MW}" height="${MH}" class="osea"/>`;
  if (hl.hemi) { const h = hl.hemi; s += `<rect x="${h.ew > 0 ? X(0) : MX}" y="${h.ns > 0 ? MY : Y(0)}" width="${h.ew > 0 ? MX + MW - X(0) : X(0) - MX}" height="${h.ns > 0 ? Y(0) - MY : MY + MH - Y(0)}" class="oband"/>`; }
  s += `<g clip-path="url(#${KEY}-clip)"><path d="${LAND}" transform="translate(${MX} ${MY})" class="oland"/></g>`;
  for (let lat = 70; lat >= -70; lat -= 10) s += `<line x1="${MX}" x2="${MX + MW}" y1="${Y(lat)}" y2="${Y(lat)}" class="${lat === 0 ? "oeq" : lat % 30 ? "gmin" : "gmaj"}"/>`;
  for (let lon = -170; lon <= 170; lon += 10) s += `<line y1="${MY}" y2="${MY + MH}" x1="${X(lon)}" x2="${X(lon)}" class="${lon === 0 ? "oeq" : lon % 30 ? "gmin" : "gmaj"}"/>`;
  s += `<rect x="${MX}" y="${MY}" width="${MW}" height="${MH}" class="oframe"/>`;
  for (const lat of [60, 30, 0, -30, -60]) s += `<text x="${MX - 4}" y="${Y(lat) + 4}" text-anchor="end" class="oax">${latS(lat).replace(" ", "")}</text>`;
  for (let lon = -180; lon <= 180; lon += 60) s += `<text x="${X(lon)}" y="${MY + MH + 15}" text-anchor="middle" class="oax">${lonS(lon).replace(" ", "")}</text>`;
  s += `<text x="${MX}" y="${MY + MH + 31}" class="osm">lines every 10° · bold lines: Equator (0°) and Prime Meridian (0°)</text>`;
  if (hl.guide) for (const p of hl.guide) s += `<line x1="${MX}" x2="${X(p.lon)}" y1="${Y(p.lat)}" y2="${Y(p.lat)}" class="oguide"/><line x1="${X(p.lon)}" x2="${X(p.lon)}" y1="${Y(p.lat)}" y2="${MY + MH}" class="oguide"/>`;
  if (opt.route && F.route) {
    const R = F.route, d = R.wp.map((p, i) => `${i ? "L" : "M"}${X(p.lon).toFixed(1)} ${Y(p.lat).toFixed(1)}`).join("");
    s += `<path d="${d}" class="oroute" marker-end="url(#${KEY}-arr)"/>`;
    const st = R.wp[0], en = R.wp[R.wp.length - 1];
    s += `<circle cx="${X(st.lon)}" cy="${Y(st.lat)}" r="4.5" class="opt"/><text x="${X(st.lon) + 7}" y="${Y(st.lat) - 6}" class="olab">start</text><text x="${X(en.lon) + 7}" y="${Y(en.lat) + 14}" class="olab">end</text>`;
    s += `<g transform="translate(${MX + MW - 34} ${MY + 30})"><line x1="0" y1="18" x2="0" y2="-12" class="omline" marker-end="url(#${KEY}-arr)"/><text x="0" y="-16" text-anchor="middle" class="olab">N</text></g>`;
  }
  if (opt.detBox) { const D = F.det; s += `<rect x="${X(D.lo0) - 3}" y="${Y(D.la0 + 2) - 3}" width="${2 * K + 6}" height="${2 * K + 6}" class="odetbox"/><text x="${X(D.lo0 + 2) + 6}" y="${Y(D.la0 + 2) + 4}" class="olab">R</text>`; }
  if (opt.points !== false && !opt.route) F.pts.forEach((p) => {
    const x = X(p.lon), y = Y(p.lat), on = (hl.pts || []).includes(p.id);
    s += `<circle cx="${x}" cy="${y}" r="4.5" class="opt${on ? " ohl" : ""}"/><text x="${x + 7}" y="${p.lat > 68 ? y + 15 : y - 6}" class="olab">${p.id}</text>`;
    if (opt.tapMode) s += `<circle cx="${x}" cy="${y}" r="13" fill="transparent" data-tap="${p.id}"/>`;
  });
  if (hl.target) s += `<circle cx="${X(hl.target.lon)}" cy="${Y(hl.target.lat)}" r="9" class="otarget"/>`;
  if (opt.plotMode) s += `<rect x="${MX}" y="${MY}" width="${MW}" height="${MH}" fill="transparent" class="plothit"/>`;
  if (opt.state && typeof opt.state.lat === "number") { const x = X(opt.state.lon), y = Y(opt.state.lat); s += `<path d="M${x - 6} ${y - 6}L${x + 6} ${y + 6}M${x + 6} ${y - 6}L${x - 6} ${y + 6}" class="oX"/>`; }
  return { s, h: MY + MH + 38 };
}

/* detail map: a 2° × 2° area R with lines every 30′, labelled in degrees and minutes */
function detailSVG(F, opt, y0) {
  const D = F.det, hl = opt.hl || {}, L = 150, T = y0 + 34, S = 220, step = S / 4, x = (lo) => L + ((lo - D.lo0) / 2) * S, y = (la) => T + ((D.la0 + 2 - la) / 2) * S;
  let s = `<text x="${W / 2}" y="${y0 + 18}" text-anchor="middle" class="olab">Detail of area R · lines every 30′ · 60′ (minutes) = 1°</text>`;
  s += `<rect x="${L}" y="${T}" width="${S}" height="${S}" class="osea"/>`;
  for (let i = 0; i <= 4; i++) { s += `<line x1="${L}" x2="${L + S}" y1="${T + i * step}" y2="${T + i * step}" class="${i % 2 ? "gmin" : "gmaj"}"/><line y1="${T}" y2="${T + S}" x1="${L + i * step}" x2="${L + i * step}" class="${i % 2 ? "gmin" : "gmaj"}"/>`; }
  s += `<rect x="${L}" y="${T}" width="${S}" height="${S}" class="oframe"/>`;
  for (let i = 0; i <= 4; i += 2) { const la = D.la0 + 2 - i * 0.5, lo = D.lo0 + i * 0.5; s += `<text x="${L - 6}" y="${T + i * step + 4}" text-anchor="end" class="oax">${latDM(la)}</text><text x="${L + i * step}" y="${T + S + 16}" text-anchor="middle" class="oax">${lonDM(lo)}</text>`; }
  const p = D.p; s += `<circle cx="${x(p.lon)}" cy="${y(p.lat)}" r="5" class="opt${hl.det ? " ohl" : ""}"/><text x="${x(p.lon) + 8}" y="${y(p.lat) - 7}" class="olab">P</text>`;
  if (hl.det) s += `<line x1="${L}" x2="${x(p.lon)}" y1="${y(p.lat)}" y2="${y(p.lat)}" class="oguide"/>`;
  return { s, h: T + S + 26 };
}

function svg(F, opt) {
  opt = opt || {};
  const wm = worldSVG(F, opt); let s = wm.s, h = wm.h;
  if (opt.detail) { const d = detailSVG(F, opt, h); s += d.s; h = d.h; }
  return `<svg viewBox="0 0 ${W} ${h}" class="figsvg fig-${KEY}" role="img" aria-label="World map of the oceans with lines of latitude and longitude">${s}</svg>`;
}

function questions(F, r) {
  const qs = [], P = F.pts, byOcean = (o) => P.find((p) => p.ocean === o);
  // 1. tap the point in a named ocean
  const tOcean = pickR(r, OCEANS), tp = byOcean(tOcean);
  qs.push({ kind: "tap", q: `Tap the point that is in the <b>${tOcean}</b>.`, a: [tp.id], ansTxt: `point ${tp.id}`, labelOf: (id) => `point ${id}`, askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, hl: { pts: [tp.id] } }),
    why: `Point ${tp.id} is in the <b>${tOcean}</b>. ${oceanHint(tOcean)}` });
  // 2. which ocean is point X in (choice; one distractor is the classic "a large sea is an ocean" or a neighbouring ocean)
  const cp = pickR(r, P.filter((p) => p !== tp)), opts = [cp.ocean, ...shuffleR(r, OCEANS.filter((o) => o !== cp.ocean)).slice(0, 3)];
  qs.push({ kind: "choice", q: `Which ocean is point <b>${cp.id}</b> in?`, options: opts, a: 0, hl: { pts: [cp.id] },
    why: `Point ${cp.id} is at about ${cp.ocean === "Arctic Ocean" || cp.ocean === "Southern Ocean" ? latS(cp.lat) : `${latS(cp.lat)}, ${lonS(cp.lon)}`}: the <b>${cp.ocean}</b>. ${oceanHint(cp.ocean)}` });
  // 3. latitude or longitude of a point on the 10° grid (choice)
  const gp = P.filter((p) => p.lat % 10 === 0 && p.lon % 10 === 0 && Math.abs(p.lat) <= 60);
  if (r() < 0.5) {
    const pa = pickR(r, gp), lo = [pa.lat, -pa.lat, pa.lat + 10, pa.lat - 10].filter((v, i, a) => a.indexOf(v) === i && v !== 0 && Math.abs(v) <= 80);
    while (lo.length < 4) { const v = pickR(r, [-60, -50, -40, -30, -20, -10, 10, 20, 30, 40, 50, 60]); if (!lo.includes(v)) lo.push(v); }
    qs.push({ kind: "choice", q: `What is the latitude of point ${pa.id}?`, options: lo.map(latS), a: 0, hl: { pts: [pa.id], guide: [pa] },
      why: `Follow the line of latitude through ${pa.id} to the left-hand edge. Lines are every 10°, labelled every 30°. ${pa.id} is ${Math.abs(pa.lat)}° ${pa.lat > 0 ? "<b>north</b>" : "<b>south</b>"} of the Equator: <b>${latS(pa.lat)}</b>. Lines of latitude run east–west; always give N or S.` });
  } else {
    const pb = pickR(r, gp.filter((p) => Math.abs(p.lon) <= 160)) || pickR(r, gp), lo = [pb.lon, -pb.lon, pb.lon + 10, pb.lon - 10].filter((v, i, a) => a.indexOf(v) === i && v !== 0 && Math.abs(v) < 180);
    while (lo.length < 4) { const v = (Math.floor(r() * 35) - 17) * 10; if (v && !lo.includes(v)) lo.push(v); }
    qs.push({ kind: "choice", q: `What is the longitude of point ${pb.id}?`, options: lo.map(lonS), a: 0, hl: { pts: [pb.id], guide: [pb] },
      why: `Follow the line of longitude through ${pb.id} down to the bottom edge. Lines are every 10°, labelled every 60°. ${pb.id} is ${Math.abs(pb.lon)}° ${pb.lon > 0 ? "<b>east</b>" : "<b>west</b>"} of the Prime Meridian: <b>${lonS(pb.lon)}</b>. Lines of longitude run north–south and meet at the poles.` });
  }
  // 4. hemisphere and side of the Prime Meridian (tap)
  const H = F.hemi, hName = `${H.ns > 0 ? "Northern" : "Southern"} Hemisphere and ${H.ew > 0 ? "east" : "west"} of the Prime Meridian`;
  qs.push({ kind: "tap", q: `Tap the only point that is in the <b>${hName}</b>.`, a: [H.id], ansTxt: `point ${H.id}`, labelOf: (id) => `point ${id}`, askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, hl: { hemi: H, pts: [H.id] } }),
    why: `${H.ns > 0 ? "North" : "South"} of the Equator is the ${H.ns > 0 ? "Northern" : "Southern"} Hemisphere; ${H.ew > 0 ? "east" : "west"} of the Prime Meridian (0°) is ${H.ew > 0 ? "E" : "W"} longitude. Only point ${H.id} (${pos(P.find((p) => p.id === H.id))}) is in the shaded quarter.` });
  // 5. difference in latitude between two points on the grid (num)
  const pairs = []; for (const a of gp) for (const b of gp) if (a.id < b.id && a.lat !== b.lat) pairs.push([a, b]);
  if (pairs.length) {
    const opp = pairs.filter(([a, b]) => a.lat * b.lat < 0), [p1, p2] = pickR(r, opp.length && r() < 0.7 ? opp : pairs), dl = Math.abs(p1.lat - p2.lat);
    qs.push({ kind: "num", q: `How many degrees of latitude apart are point ${p1.id} and point ${p2.id}?`, ans: dl, tol: 0, unit: "°", hl: { pts: [p1.id, p2.id], guide: [p1, p2] },
      why: `${p1.id} is at ${latS(p1.lat)} and ${p2.id} is at ${latS(p2.lat)}. ${p1.lat * p2.lat < 0 ? `They are on opposite sides of the Equator, so <b>add</b>: ${Math.abs(p1.lat)} + ${Math.abs(p2.lat)}` : `They are on the same side of the Equator, so <b>subtract</b>: ${Math.max(Math.abs(p1.lat), Math.abs(p2.lat))} − ${Math.min(Math.abs(p1.lat), Math.abs(p2.lat))}`} = <b>${dl}°</b>.` });
  }
  // 6. degrees and minutes from the detail map (choice; distractors = other hemisphere, 30′ off, and "0.5° = 50′")
  const D = F.det, pl = D.p.lat, a = Math.abs(pl), d0 = Math.floor(a), half = a - d0 > 0.25;
  const wrongMin = `${d0}° 50′ ${pl > 0 ? "N" : "S"}`;
  const dopts = [latDM(pl), latDM(-pl), latDM(pl > 0 ? pl + 0.5 : pl - 0.5), half ? wrongMin : latDM(pl > 0 ? pl - 0.5 : pl + 0.5)].filter((v, i, arr) => arr.indexOf(v) === i);
  while (dopts.length < 4) dopts.push(latDM(pl > 0 ? pl + 1 : pl - 1));
  qs.push({ kind: "choice", q: `The detail map shows area R in more detail. What is the <b>latitude</b> of point P, in degrees and minutes?`, options: dopts.slice(0, 4), a: 0, askOpt: { detail: true, detBox: true, points: false }, doneOpt: () => ({ detail: true, detBox: true, points: false, hl: { det: true } }),
    why: `Only whole degrees are labelled; the lines between them are every 30′, because 60′ = 1°. Point P is on the line halfway between ${latDM(pl > 0 ? Math.floor(pl) : Math.ceil(pl))} and ${latDM(pl > 0 ? Math.ceil(pl) : Math.floor(pl))}, so its latitude is <b>${latDM(pl)}</b>. Half a degree is 30′, not 50′: there are 60 minutes in a degree, not 100.` });
  // 7. place an X at given coordinates (plot, snap 5°, accepted within 5°)
  const T = F.target;
  qs.push({ kind: "plot", q: `Place an X on the map at <b>${latS(T.lat)}, ${lonS(T.lon)}</b>. Tap the map, then use the buttons to adjust.`, hl: { target: T },
    askOpt: { plotMode: true, points: false },
    plot: {
      start: { lat: 75, lon: -175 }, answer: { lat: T.lat, lon: T.lon }, hint: "Tap the map to place your X.",
      fromTap: (p) => { const lon = Math.round(((p.x - MX) / K - 180) / 5) * 5, lat = Math.round((TOP - (p.y - MY) / K) / 5) * 5; return { lat: Math.max(BOT, Math.min(TOP, lat)), lon: Math.max(-180, Math.min(180, lon)) }; },
      nudges: [["w", "◀ 5°", "Move the X 5 degrees west"], ["s", "▼ 5°", "Move the X 5 degrees south"], ["n", "▲ 5°", "Move the X 5 degrees north"], ["e", "5° ▶", "Move the X 5 degrees east"]],
      nudge: (st, k) => ({ lat: Math.max(BOT, Math.min(TOP, st.lat + (k === "n" ? 5 : k === "s" ? -5 : 0))), lon: Math.max(-180, Math.min(180, st.lon + (k === "e" ? 5 : k === "w" ? -5 : 0))) }),
      label: () => "X placed.",
      check: (st) => Math.abs(st.lat - T.lat) <= 5 && Math.abs(st.lon - T.lon) <= 5,
    },
    doneOpt: (st) => ({ state: st, points: false, hl: { target: T, guide: [T] } }),
    doneNote: (st, ok) => (ok ? "" : `The correct place is circled: ${latS(T.lat)}, ${lonS(T.lon)}.`),
    why: `Find ${latS(T.lat)} up the side (${T.lat > 0 ? "north of" : T.lat < 0 ? "south of" : "on"} the Equator), then ${lonS(T.lon)} along the bottom (${T.lon > 0 ? "east" : "west"} of 0°). The X goes where the two lines cross. Latitude is always given first. Accepted to within 5°.` });
  // 8. direction of a migration route (choice, 8-point compass; north is up)
  if (F.route) {
    const R = F.route, d = R.dir, dopt = [DIRS[d], DIRS[(d + 4) % 8], DIRS[(d + 1) % 8], DIRS[(d + 7) % 8]];
    qs.push({ kind: "choice", q: `The dashed line shows the route of ${R.animal} from its start to its end. In which direction did it travel overall?`, options: dopt, a: 0, askOpt: { route: true }, doneOpt: () => ({ route: true }),
      why: `Compare the end with the start. North is up the map. The end is ${dirExplain(R)} of the start, so the overall direction is <b>${DIRS[d]}</b>. Use the start and end points, not the bends in between.` });
  }
  // 9. climate zone of a point from its latitude (tropical up to 23.5°, temperate to 66.5°, polar beyond); points within 5° of a boundary are never asked
  const zone = (lat) => (Math.abs(lat) < 23.5 ? "tropical" : Math.abs(lat) < 66.5 ? "temperate" : "polar");
  const zp = P.filter((p) => [23.5, 66.5].every((b) => Math.abs(Math.abs(p.lat) - b) >= 5));
  if (zp.length) {
    const zq = pickR(r, zp), z = zone(zq.lat), zo = ["tropical", "temperate", "polar"];
    qs.push({ kind: "choice", q: `Which climate zone is point <b>${zq.id}</b> in? Use its latitude.`, options: [z, ...zo.filter((x) => x !== z)], a: 0, hl: { pts: [zq.id], guide: [zq] },
      why: `The <b>tropical</b> zone lies between the Tropic of Cancer (23.5° N) and the Tropic of Capricorn (23.5° S). The <b>polar</b> zones lie beyond the Arctic Circle (66.5° N) and the Antarctic Circle (66.5° S). The <b>temperate</b> zones lie between 23.5° and 66.5° in each hemisphere. ${zq.id} is ${Math.abs(zq.lat)}° ${zq.lat > 0 ? "north" : "south"} of the Equator, so it is in the <b>${z}</b> zone.` });
  }
  // keep at most 8: always 1, 2, 4, 6, 7 (+ route, climate zone), then fill with 3/5
  const core = qs.filter((q) => q.kind === "tap" || q.kind === "plot" || /detail map|Which ocean|climate zone/.test(q.q) || /route/.test(q.q)), extra = shuffleR(r, qs.filter((q) => !core.includes(q)));
  return core.concat(extra).slice(0, 8).sort((x, y) => qs.indexOf(x) - qs.indexOf(y));
}
const pos = (p) => `${latS(p.lat)}, ${lonS(p.lon)}`;
function dirExplain(R) { const s = R.wp[0], e = R.wp[R.wp.length - 1], ns = e.lat > s.lat + 3 ? "north" : e.lat < s.lat - 3 ? "south" : "", ew = e.lon > s.lon + 3 ? "east" : e.lon < s.lon - 3 ? "west" : ""; return ns && ew ? `further ${ns} and further ${ew}` : `further ${ns || ew}`; }
function oceanHint(o) {
  return { "Pacific Ocean": "The Pacific lies between Asia and Australia in the west and the Americas in the east.", "Atlantic Ocean": "The Atlantic lies between the Americas in the west and Europe and Africa in the east.", "Indian Ocean": "The Indian Ocean lies south of Asia, between Africa and Australia.", "Arctic Ocean": "The Arctic Ocean is around the North Pole, north of Europe, Asia and North America.", "Southern Ocean": "The Southern Ocean surrounds Antarctica, south of about 60° S." }[o];
}

function selfTest(F, qs) {
  const bad = [];
  for (const p of F.pts) if (!openWater(p.lat, p.lon, 2)) bad.push(`point ${p.id} not on open water`);
  if (new Set(F.pts.map((p) => p.ocean)).size !== 5) bad.push("not one point per ocean");
  for (const p of F.pts) { const o = p.ocean; if (o === "Arctic Ocean" && p.lat < 70) bad.push("arctic too far south"); if (o === "Southern Ocean" && p.lat > -62) bad.push("southern too far north"); if (o === "Indian Ocean" && !(p.lon > 40 && p.lon < 110 && p.lat < 0)) bad.push("indian box"); }
  if (!openWater(F.target.lat, F.target.lon, 3)) bad.push("target on land");
  const hm = F.pts.filter((p) => Math.sign(p.lat) === F.hemi.ns && Math.sign(p.lon) === F.hemi.ew); if (hm.length !== 1 || hm[0].id !== F.hemi.id) bad.push("hemisphere answer not unique");
  if (F.route) { const s = F.route.wp[0], e = F.route.wp[3], ang = (Math.atan2(e.lon - s.lon, e.lat - s.lat) * 180) / Math.PI; let df = Math.abs(((ang - F.route.dir * 45) % 360 + 540) % 360 - 180); if (df > 12.5) bad.push("route direction off " + df); }
  const dq = qs.find((q) => /detail map/.test(q.q)); if (!dq || new Set(dq.options).size !== 4) bad.push("detail options");
  if (qs.length < 6) bad.push("too few questions " + qs.length);
  const cz = qs.find((q) => /climate zone/.test(q.q)); if (cz) { const lat = Math.abs(F.pts.find((p) => p.id === cz.q.match(/point <b>(\w)<\/b>/)[1]).lat); const z = lat < 23.5 ? "tropical" : lat < 66.5 ? "temperate" : "polar"; if (cz.options[cz.a] !== z || Math.abs(lat - 23.5) < 5 || Math.abs(lat - 66.5) < 5) bad.push("climate zone"); }
  return bad;
}

export default {
  key: KEY, group: "Maps", zoomDefault: true, name: "World ocean map: latitude and longitude", topics: "Unit 1 (1.3)", thumbSeed: 5,
  blurb: "A world map with the five oceans, lines of latitude and longitude, a detail map in degrees and minutes, and a tracked migration route.",
  tips: ["The five oceans are the Arctic, Atlantic, Pacific, Indian and Southern. Large seas such as the Mediterranean are not oceans.", "Latitude is measured north or south of the Equator; longitude east or west of the Prime Meridian (0°). Give latitude first, with N/S and E/W.", "On opposite sides of the Equator, add the two latitudes to find the difference; on the same side, subtract.", "1 degree = 60 minutes (60′). Half a degree is 30′, not 50′.", "For a direction, compare the end with the start. North is up the map.", "Climate zones: tropical between 23.5° N and 23.5° S; temperate from 23.5° to 66.5°; polar beyond 66.5° N or S."],
  ctx: (F) => "world map of the oceans",
  make, svg, questions, selfTest,
  css: `.fig-oceanmap .oland{fill:color-mix(in srgb,var(--ink) 22%,transparent);stroke:currentColor;stroke-width:.6}.fig-oceanmap .osea{fill:var(--surface2)}.fig-oceanmap .oframe{fill:none;stroke:currentColor;stroke-width:1.2}.fig-oceanmap .oeq{stroke:currentColor;stroke-width:1.4}.fig-oceanmap .oax{font-size:12px}.fig-oceanmap .osm{font-size:12px;opacity:.85}.fig-oceanmap .olab{font-size:14px;font-weight:700}.fig-oceanmap .opt{fill:currentColor}.fig-oceanmap .opt.ohl{fill:var(--app);stroke:currentColor;stroke-width:1.5}.fig-oceanmap .oband{fill:color-mix(in srgb,var(--app) 22%,transparent)}.fig-oceanmap .oguide{stroke:var(--app);stroke-width:2;stroke-dasharray:5 3}.fig-oceanmap .otarget{fill:none;stroke:var(--app);stroke-width:3}.fig-oceanmap .oX{stroke:var(--accent);stroke-width:3.2}.fig-oceanmap .oroute{fill:none;stroke:currentColor;stroke-width:2.2;stroke-dasharray:7 4}.fig-oceanmap .omarr{fill:currentColor}.fig-oceanmap .omline{stroke:currentColor;stroke-width:2}.fig-oceanmap .odetbox{fill:none;stroke:var(--accent);stroke-width:2}`,
};
