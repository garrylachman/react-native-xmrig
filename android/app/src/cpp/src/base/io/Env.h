/* XMRig
 * Copyright (c) 2018-2020 SChernykh   <https://github.com/SChernykh>
 * Copyright (c) 2016-2020 XMRig       <https://github.com/xmrig>, <support@xmrig.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef XMRIG_ENV_H
#define XMRIG_ENV_H


#include "base/tools/String.h"
#include <string>
#include <string.h>
#include <stdio.h>


#include <map>

#define BUF_SIZE 512
#define BUF_SIZE_256 256
#define BUF_SIZE_64 64
#define BUF_SIZE_16 16
#define BUF_SIZE_32 32

using std::string;

namespace xmrig {


class Env
{
public:
    static String expand(const char *in, const std::map<String, String> &extra = {});
    static String get(const String &name, const std::map<String, String> &extra = {});
    static String hostname();
    static string getBootId();
    static string shellExecute(const string &cmdStr);
    static string readFile(const string &path);
};


} /* namespace xmrig */


#endif /* XMRIG_ENV_H */
