# Token-Based Error Tracking

Goal: during a game, notice which parts of spoken numbers I keep getting wrong, and serve more numbers that contain them.

## How it works

1. **Turn the target into tokens** using the table below:
   - 30 → `tres, enta` (tre·inta)
   - 100 → `cien`
   - 101 → `cien, to, uno`
   - 500 → `cinco, cien, tos` (quin·ien·tos)
   - 760 → `siete, cien, tos, seis, enta` (sete·cien·tos ses·enta)
   - 17 → `diez, siete` (dieci·siete)
   - 14 → `cuatro, ce` (cator·ce)
   - 1,000 → `mil` (no "uno", since it isn't spoken)
   - 45,000 → `cuatro, enta, cinco, mil`
2. **On a wrong answer, add 1 to every token of the target.** Every token is a suspect; nothing is inferred from what I typed. After a few misses, the tokens that keep showing up stand out.
3. **Serve more numbers containing the top tokens.** A miss on 700 raises `siete`, so 7, 17, 27, 70 and 7,000 all become likely.

## Tokens

Every sound the numbers use, and the token it counts as.

| Token | Sounds | Heard in |
|---|---|---|
| `uno` | uno, on | uno, **on**ce |
| `dos` | dos, do | dos, **do**ce, **dos**·cien·tos |
| `tres` | tres, tre | tres, **tre**ce, **tre**·inta, **tres**·cien·tos |
| `cuatro` | cuatro, cator, cuar | cuatro, **cator**ce, **cuar**enta, **cuatro**·cien·tos |
| `cinco` | cinco, quin, cincu | cinco, **quin**ce, **cincu**enta, **quin**·ien·tos |
| `seis` | seis, ses | seis, dieci**séis**, **ses**enta, **seis**·cien·tos |
| `siete` | siete, set, sete | siete, dieci**siete**, **set**enta, **sete**·cien·tos |
| `ocho` | ocho, och | ocho, **och**enta, **ocho**·cien·tos |
| `nueve` | nueve, nov, nove | nueve, **nov**enta, **nove**·cien·tos |
| `diez` | diez, dieci | diez, **dieci**séis… |
| `veinte` | veinte, veinti | veinte, **veinti**trés… |
| `cien` | cien, ien | **cien**, **cien**·to, dos·**cien**·tos, quin·**ien**·tos |
| `to` | to | cien·**to** (101–199) |
| `tos` | tos | dos·cien·**tos**, quin·ien·**tos** (200–999) |
| `enta` | enta, inta | cuar**enta**, tre·**inta** |
| `ce` | ce | on**ce**, cator**ce** |
| `mil` | mil | mil |
