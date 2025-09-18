/* Copyright (C) 2025 MarcosHCK
 * This file is part of uh-statistics.
 *
 * uh-statistics is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * uh-statistics is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with uh-statistics. If not, see <https://www.gnu.org/licenses/>.
 */

export interface SimpleType
{

  variable1: string;
  variable2: string | string[];
  variable3?: string | string[];
  variable4: boolean | number;
  variable5?: boolean | number;
  variable6: { subVar1: number };
  variable7: { subVar2: number } & { subVar3: boolean };
  variable8: { subVar2: number } | { subVar2: boolean };
}