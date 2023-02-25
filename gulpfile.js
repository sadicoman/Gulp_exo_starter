const gulp = require("gulp");
const sass = require("gulp-dart-sass");

const strip = require("gulp-strip-banner");
const webp = require("gulp-webp");

const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const eslint = require("gulp-eslint");
const imagemin = require("gulp-imagemin");
const browserSyncServer = require("browser-sync").create();

const css = () => {
	return gulp
		.src("./src/assets/sass/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(
			postcss([
				autoprefixer({
					overrideBrowserslist: ["last 2 versions", "ie >= 10"],
				}),
			]),
		)
		.pipe(strip())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("./dist/assets/css/"))
		.pipe(browserSyncServer.stream());
};

const javascript = () => {
	return gulp
		.src("./src/assets/js/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(eslint())
		.pipe(babel())
		.pipe(concat("main.min.js"))
		.pipe(strip())
		.pipe(uglify())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("./dist/assets/js/"))
		.pipe(browserSyncServer.stream());
};

const html = () => {
	return gulp.src("./src/*.html").pipe(gulp.dest("./dist/"));
};

const fonts = () => {
	return gulp
		.src([
			"./src/assets/fonts/**/*.ttf",
			"./src/assets/fonts/**/*.woff",
			"./src/assets/fonts/**/*.woff2",
		])
		.pipe(gulp.dest("./dist/assets/fonts/"));
};

const watchFiles = () => {
	gulp.watch("./src/assets/sass/**/*.scss", css);
	gulp.watch("./src/assets/js/**/*.js", javascript);
	gulp.watch(
		[
			"./src/assets/fonts/**/*.ttf",
			"./src/assets/fonts/**/*.woff",
			"./src/assets/fonts/**/*.woff2",
		],
		fonts,
	);
	gulp.watch(
		[
			"./src/assets/images/**/*.svg",
			"./src/assets/images/**/*.jpg",
			"./src/assets/images/**/*.png",
			"./src/assets/images/**/*.gif",
		],
		webpImages,
	);
	gulp.watch(
		[
			"./src/assets/images/**/*.svg",
			"./src/assets/images/**/*.jpg",
			"./src/assets/images/**/*.png",
			"./src/assets/images/**/*.gif",
			"./src/assets/images/**/*.webp",
		],
		compressImages,
	);
	gulp.watch("./src/*.html", gulp.series(html, browserReload));
};

const browserSync = (done) => {
	browserSyncServer.init({
		server: {
			baseDir: "./dist",
		},
		port: 3000,
	});
	done();
};

const browserReload = (done) => {
	browserSyncServer.reload();
	done();
};

const webpImages = () => {
	return gulp
		.src([
			"./src/assets/images/**/*.svg",
			"./src/assets/images/**/*.jpg",
			"./src/assets/images/**/*.png",
			"./src/assets/images/**/*.gif",
		])
		.pipe(webp())
		.pipe(gulp.dest("./src/assets/images/"));
};

const compressImages = () => {
	return gulp
		.src([
			"./src/assets/images/**/*.svg",
			"./src/assets/images/**/*.jpg",
			"./src/assets/images/**/*.png",
			"./src/assets/images/**/*.gif",
			"./src/assets/images/**/*.webp",
		])
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
			}),
		)
		.pipe(gulp.dest("./dist/assets/images/"));
};

const build = gulp.series(
	html,
	css,
	javascript,
	webpImages,
	compressImages,
	fonts,
);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
const compress = gulp.series(compressImages);

exports.watch = watch;
exports.compress = compress;
exports.default = build;
