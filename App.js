import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COURSES = ['Starter', 'Main Course', 'Dessert'];
const FILTERS = ['All courses', ...COURSES];
const COLORS = {
  ink: '#25213A', muted: '#777487', plum: '#6846A5', plumDark: '#523485',
  lilac: '#F0EAF8', canvas: '#F8F6FA', white: '#FFFFFF', line: '#E9E5EF',
  green: '#2E7D5B', greenBg: '#E8F5EE', red: '#B4233D', redBg: '#FFF0F2',
};

const formatPrice = value => `R ${Number(value).toFixed(2)}`;

function FieldLabel({ children }) {
  return <Text style={styles.label}>{children}<Text style={styles.required}> *</Text></Text>;
}

function CoursePill({ course }) {
  return <View style={styles.coursePill}><Text style={styles.courseText}>{course}</Text></View>;
}

function MenuCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.menuCard}>
      <View style={styles.cardTop}>
        <View style={styles.dishCopy}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishDescription} numberOfLines={3}>{item.description}</Text>
        </View>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.cardFooter}>
        <CoursePill course={item.course} />
        <View style={styles.cardActions}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${item.name}`} onPress={() => onEdit(item)} style={styles.smallAction}>
            <Text style={styles.editAction}>Edit</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${item.name}`} onPress={() => onDelete(item)} style={[styles.smallAction, styles.deleteAction]}>
            <Text style={styles.deleteActionText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function StatCard({ label, value, detail }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statDetail}>{detail}</Text>
    </View>
  );
}

function MenuForm({ visible, editingItem, onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [courseOpen, setCourseOpen] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (!visible) return;
    setName(editingItem?.name || '');
    setDescription(editingItem?.description || '');
    setCourse(editingItem?.course || '');
    setPrice(editingItem ? String(editingItem.price) : '');
    setErrors({});
    setCourseOpen(false);
  }, [visible, editingItem]);

  function close() {
    Keyboard.dismiss();
    setCourseOpen(false);
    onClose();
  }

  function save() {
    Keyboard.dismiss();
    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const amount = Number(price);
    if (!trimmedName) nextErrors.name = 'Enter the dish name.';
    if (!trimmedDescription) nextErrors.description = 'Enter a short description.';
    if (!course) nextErrors.course = 'Choose a course.';
    if (!price.trim()) nextErrors.price = 'Enter the price.';
    else if (!/^\d+(\.\d{1,2})?$/.test(price.trim()) || !Number.isFinite(amount) || amount <= 0) {
      nextErrors.price = 'Enter a price greater than R 0.00 (up to 2 decimal places).';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      id: editingItem?.id,
      name: trimmedName,
      description: trimmedDescription,
      course,
      price: amount.toFixed(2),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <SafeAreaView style={styles.modalSafe}>
        <KeyboardAvoidingView style={styles.modalSafe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close form" onPress={close} style={styles.closeButton}><Text style={styles.closeButtonText}>×</Text></Pressable>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit menu item' : 'New menu item'}</Text>
            <View style={styles.closeSpacer} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.formContent}>
            <Text style={styles.formIntro}>{editingItem ? 'Update the details for this dish.' : 'Add the details for your next dish.'}</Text>
            <FieldLabel>Dish name</FieldLabel>
            <TextInput
              accessibilityLabel="Dish name" style={[styles.input, errors.name && styles.inputError]}
              value={name} onChangeText={value => { setName(value); if (errors.name) setErrors(current => ({ ...current, name: undefined })); }}
              placeholder="e.g. Roasted tomato soup" placeholderTextColor="#A5A1AF" returnKeyType="next" maxLength={60}
            />
            {errors.name ? <Text accessibilityRole="alert" style={styles.errorText}>{errors.name}</Text> : null}

            <FieldLabel>Description</FieldLabel>
            <TextInput
              accessibilityLabel="Description" style={[styles.input, styles.descriptionInput, errors.description && styles.inputError]}
              value={description} onChangeText={value => { setDescription(value); if (errors.description) setErrors(current => ({ ...current, description: undefined })); }}
              placeholder="Describe the dish and what makes it special" placeholderTextColor="#A5A1AF" multiline textAlignVertical="top" maxLength={180}
            />
            {errors.description ? <Text accessibilityRole="alert" style={styles.errorText}>{errors.description}</Text> : null}

            <FieldLabel>Course</FieldLabel>
            <Pressable accessibilityRole="button" accessibilityLabel="Choose course" accessibilityState={{ expanded: courseOpen }} onPress={() => setCourseOpen(value => !value)} style={[styles.input, styles.courseSelector, errors.course && styles.inputError]}>
              <Text style={course ? styles.selectorValue : styles.placeholder}>{course || 'Select a course'}</Text><Text style={styles.chevron}>{courseOpen ? '⌃' : '⌄'}</Text>
            </Pressable>
            {courseOpen ? <View style={styles.courseOptions}>{COURSES.map(option => <Pressable key={option} accessibilityRole="button" onPress={() => { setCourse(option); setCourseOpen(false); if (errors.course) setErrors(current => ({ ...current, course: undefined })); }} style={styles.courseOption}><Text style={[styles.courseOptionText, option === course && styles.courseOptionSelected]}>{option}</Text>{option === course ? <Text style={styles.selectedCheck}>✓</Text> : null}</Pressable>)}</View> : null}
            {errors.course ? <Text accessibilityRole="alert" style={styles.errorText}>{errors.course}</Text> : null}

            <FieldLabel>Price</FieldLabel>
            <View style={[styles.priceInputWrap, errors.price && styles.inputError]}>
              <Text style={styles.currencyPrefix}>R</Text>
              <TextInput accessibilityLabel="Price in South African rand" style={styles.priceInput}
                value={price} onChangeText={value => { setPrice(value.replace(/[^0-9.]/g, '')); if (errors.price) setErrors(current => ({ ...current, price: undefined })); }}
                placeholder="0.00" placeholderTextColor="#A5A1AF" keyboardType="decimal-pad" returnKeyType="done" onSubmitEditing={save}
              />
            </View>
            {errors.price ? <Text accessibilityRole="alert" style={styles.errorText}>{errors.price}</Text> : null}

            <Pressable accessibilityRole="button" onPress={save} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
              <Text style={styles.submitButtonText}>{editingItem ? 'Save changes' : 'Add to menu'}</Text><Text style={styles.submitArrow}>→</Text>
            </Pressable>
            <Text style={styles.requiredHint}>Fields marked * are required.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function ConfirmDelete({ item, onCancel, onConfirm }) {
  return (
    <Modal visible={!!item} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.confirmBackdrop}>
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Delete this dish?</Text>
          <Text style={styles.confirmBody}><Text style={styles.confirmDish}>{item?.name}</Text> will be removed from your menu.</Text>
          <View style={styles.confirmActions}>
            <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Keep dish</Text></Pressable>
            <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.confirmDeleteButton}><Text style={styles.confirmDeleteText}>Delete</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All courses');
  const [notice, setNotice] = useState('');

  const stats = useMemo(() => {
    const total = items.length;
    const totalValue = items.reduce((sum, item) => sum + Number(item.price), 0);
    const byCourse = COURSES.map(course => ({ course, count: items.filter(item => item.course === course).length }));
    return { total, average: total ? totalValue / total : 0, byCourse };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return items.filter(item => {
      const matchesCourse = activeFilter === 'All courses' || item.course === activeFilter;
      const searchable = `${item.name} ${item.description} ${item.course}`.toLocaleLowerCase();
      return matchesCourse && (!query || searchable.includes(query));
    });
  }, [items, search, activeFilter]);

  function openAddForm() {
    setNotice(''); setEditingItem(null); setFormOpen(true);
  }

  function openEditForm(item) {
    setNotice(''); setEditingItem(item); setFormOpen(true);
  }

  function saveItem(item) {
    if (editingItem) {
      setItems(current => current.map(existing => existing.id === editingItem.id ? { ...item, id: editingItem.id } : existing));
      setNotice(`${item.name} was updated.`);
    } else {
      setItems(current => [{ ...item, id: `${Date.now()}-${Math.random()}` }, ...current]);
      setNotice(`${item.name} was added to the menu.`);
    }
    setFormOpen(false); setEditingItem(null);
  }

  function deleteItem() {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    setItems(current => current.filter(item => item.id !== deleteTarget.id));
    setDeleteTarget(null); setNotice(`${name} was removed from the menu.`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.canvas} />
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>CM</Text></View>
          <View style={styles.headerCopy}><Text style={styles.eyebrow}>CHEF'S TOOLKIT</Text><Text style={styles.appTitle}>Menu Manager</Text></View>
          <View style={styles.countBadge}><Text style={styles.countNumber}>{items.length}</Text><Text style={styles.countCaption}>items</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>YOUR KITCHEN, ORGANIZED</Text>
          <Text style={styles.heroTitle}>A better menu,{ '\n' }at a glance.</Text>
          <Text style={styles.heroSubtitle}>Manage dishes, find favourites and see your menu at a glance.</Text>
          <Pressable accessibilityRole="button" onPress={openAddForm} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.plus}>＋</Text><Text style={styles.primaryButtonText}>Add a menu item</Text>
          </Pressable>
        </View>

        <View style={styles.statsHeading}><Text style={styles.sectionTitle}>Menu overview</Text><Text style={styles.sectionSubtitle}>A quick look at your collection</Text></View>
        <View style={styles.statsRow}>
          <StatCard label="TOTAL DISHES" value={String(stats.total)} detail="across all courses" />
          <StatCard label="AVERAGE PRICE" value={stats.total ? formatPrice(stats.average) : '—'} detail={stats.total ? 'per menu item' : 'add a dish to begin'} />
        </View>
        <View style={styles.courseSummary}>
          {stats.byCourse.map((entry, index) => <View key={entry.course} style={[styles.courseSummaryItem, index > 0 && styles.courseSummaryBorder]}>
            <Text style={styles.courseSummaryCount}>{entry.count}</Text><Text style={styles.courseSummaryName}>{entry.course}</Text>
          </View>)}
        </View>

        <View style={styles.listHeading}>
          <View><Text style={styles.sectionTitle}>Your menu</Text><Text style={styles.sectionSubtitle}>{items.length === 1 ? '1 dish saved' : `${items.length} dishes saved`}</Text></View>
          {items.length > 0 ? <Pressable accessibilityRole="button" onPress={openAddForm} hitSlop={8}><Text style={styles.addAnother}>＋ Add new</Text></Pressable> : null}
        </View>

        {notice ? <View accessibilityRole="alert" style={styles.successNotice}><Text style={styles.successIcon}>✓</Text><Text style={styles.successText}>{notice}</Text><Pressable accessibilityRole="button" accessibilityLabel="Dismiss message" onPress={() => setNotice('')} hitSlop={8}><Text style={styles.dismiss}>×</Text></Pressable></View> : null}

        {items.length > 0 ? <>
          <View style={styles.searchWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput accessibilityLabel="Search menu items" value={search} onChangeText={setSearch} placeholder="Search dishes or descriptions" placeholderTextColor="#A5A1AF" style={styles.searchInput} returnKeyType="search" />{search ? <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setSearch('')}><Text style={styles.clearSearch}>×</Text></Pressable> : null}</View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map(filter => <Pressable accessibilityRole="button" accessibilityState={{ selected: activeFilter === filter }} key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}><Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text></Pressable>)}
          </ScrollView>
        </> : null}

        <FlatList
          data={filteredItems}
          renderItem={({ item }) => <MenuCard item={item} onEdit={openEditForm} onDelete={setDeleteTarget} />}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContent, items.length === 0 && styles.emptyListContent]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            items.length === 0 ? <View style={styles.emptyCard}>
              <View style={styles.emptyIllustration}><Text style={styles.emptyEmoji}>✦</Text></View>
              <Text style={styles.emptyTitle}>Your menu starts here</Text>
              <Text style={styles.emptyBody}>No dishes yet. Add your first menu item to see it appear here.</Text>
              <Pressable accessibilityRole="button" onPress={openAddForm} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Add your first dish</Text></Pressable>
            </View> : <View style={styles.noResults}><Text style={styles.noResultsTitle}>No matching dishes</Text><Text style={styles.noResultsBody}>Try a different search or course filter.</Text><Pressable accessibilityRole="button" onPress={() => { setSearch(''); setActiveFilter('All courses'); }}><Text style={styles.resetFilters}>Clear search and filters</Text></Pressable></View>
          }
        />

        <MenuForm visible={formOpen} editingItem={editingItem} onClose={() => { setFormOpen(false); setEditingItem(null); }} onSave={saveItem} />
        <ConfirmDelete item={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={deleteItem} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.canvas },
  screen: { flex: 1, paddingHorizontal: 22, paddingTop: 8, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 18 },
  brandMark: { width: 44, height: 44, borderRadius: 15, backgroundColor: COLORS.plum, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: COLORS.white, fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  headerCopy: { flex: 1, marginLeft: 12 }, eyebrow: { color: COLORS.plum, fontSize: 9, fontWeight: '800', letterSpacing: 1.7 },
  appTitle: { color: COLORS.ink, fontSize: 19, fontWeight: '800', marginTop: 2 },
  countBadge: { backgroundColor: COLORS.white, borderColor: COLORS.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', flexDirection: 'row', gap: 5 },
  countNumber: { color: COLORS.plum, fontWeight: '800', fontSize: 14 }, countCaption: { color: COLORS.muted, fontSize: 11, fontWeight: '600' },
  hero: { backgroundColor: COLORS.plum, borderRadius: 24, padding: 22, marginBottom: 20, overflow: 'hidden' },
  heroEyebrow: { color: '#E3D8F2', fontSize: 9, fontWeight: '800', letterSpacing: 1.6 }, heroTitle: { color: COLORS.white, fontSize: 27, lineHeight: 32, fontWeight: '800', marginTop: 10 },
  heroSubtitle: { color: '#EEE8F6', fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 360 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: COLORS.white, borderRadius: 13, paddingHorizontal: 15, height: 44, marginTop: 17, gap: 7 },
  plus: { color: COLORS.plum, fontSize: 20, fontWeight: '500', marginTop: -2 }, primaryButtonText: { color: COLORS.plumDark, fontSize: 13, fontWeight: '800' }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  statsHeading: { marginBottom: 10 }, sectionTitle: { color: COLORS.ink, fontSize: 19, fontWeight: '800' }, sectionSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: 10 }, statCard: { flex: 1, minHeight: 92, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 16, padding: 13 }, statLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }, statValue: { color: COLORS.plumDark, fontSize: 21, fontWeight: '900', marginTop: 5 }, statDetail: { color: COLORS.muted, fontSize: 10, marginTop: 2 },
  courseSummary: { flexDirection: 'row', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, marginTop: 9, marginBottom: 18, paddingVertical: 10 }, courseSummaryItem: { flex: 1, alignItems: 'center' }, courseSummaryBorder: { borderLeftWidth: 1, borderLeftColor: COLORS.line }, courseSummaryCount: { color: COLORS.ink, fontSize: 15, fontWeight: '800' }, courseSummaryName: { color: COLORS.muted, fontSize: 9, marginTop: 3, textAlign: 'center' },
  listHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, addAnother: { color: COLORS.plum, fontWeight: '800', fontSize: 12 },
  successNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.greenBg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, gap: 8 }, successIcon: { color: COLORS.green, fontSize: 15, fontWeight: '900' }, successText: { flex: 1, color: COLORS.green, fontSize: 12, fontWeight: '700' }, dismiss: { color: COLORS.green, fontSize: 20, lineHeight: 22 },
  searchWrap: { minHeight: 46, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 13, paddingHorizontal: 12, marginBottom: 9 }, searchIcon: { color: COLORS.plum, fontSize: 24, marginRight: 8, lineHeight: 27 }, searchInput: { flex: 1, color: COLORS.ink, fontSize: 12, paddingVertical: 10, outlineStyle: 'none' }, clearSearch: { color: COLORS.muted, fontSize: 20, paddingHorizontal: 5 },
  filterRow: { gap: 7, paddingBottom: 10 }, filterChip: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 8 }, activeFilterChip: { borderColor: COLORS.plum, backgroundColor: COLORS.lilac }, filterText: { color: COLORS.muted, fontSize: 10, fontWeight: '700' }, activeFilterText: { color: COLORS.plumDark },
  listContent: { paddingBottom: 22, gap: 10 }, emptyListContent: { flexGrow: 1 },
  menuCard: { backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 16, shadowColor: '#32264B', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, dishCopy: { flex: 1 }, dishName: { color: COLORS.ink, fontSize: 16, fontWeight: '800' }, dishDescription: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 5 }, price: { color: COLORS.plumDark, fontSize: 14, fontWeight: '800' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }, coursePill: { backgroundColor: COLORS.lilac, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }, courseText: { color: COLORS.plumDark, fontSize: 10, fontWeight: '800' }, cardActions: { flexDirection: 'row', gap: 7 }, smallAction: { borderRadius: 9, backgroundColor: COLORS.lilac, paddingHorizontal: 11, paddingVertical: 7 }, editAction: { color: COLORS.plumDark, fontSize: 10, fontWeight: '800' }, deleteAction: { backgroundColor: COLORS.redBg }, deleteActionText: { color: COLORS.red, fontSize: 10, fontWeight: '800' },
  emptyCard: { flex: 1, minHeight: 210, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, paddingHorizontal: 25, paddingVertical: 24 }, emptyIllustration: { width: 52, height: 52, borderRadius: 18, backgroundColor: COLORS.lilac, alignItems: 'center', justifyContent: 'center', marginBottom: 13 }, emptyEmoji: { color: COLORS.plum, fontSize: 25, fontWeight: '800' }, emptyTitle: { color: COLORS.ink, fontSize: 17, fontWeight: '800' }, emptyBody: { color: COLORS.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7, maxWidth: 280 },
  secondaryButton: { backgroundColor: COLORS.lilac, borderRadius: 11, paddingHorizontal: 16, paddingVertical: 11, marginTop: 16 }, secondaryButtonText: { color: COLORS.plumDark, fontSize: 12, fontWeight: '800' },
  noResults: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 28, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line }, noResultsTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '800' }, noResultsBody: { color: COLORS.muted, fontSize: 11, marginTop: 5, textAlign: 'center' }, resetFilters: { color: COLORS.plum, fontSize: 11, fontWeight: '800', marginTop: 12 },
  modalSafe: { flex: 1, backgroundColor: COLORS.canvas }, modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  closeButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }, closeButtonText: { color: COLORS.ink, fontSize: 24, lineHeight: 27 }, modalTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '800' }, closeSpacer: { width: 34 },
  formContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 36 }, formIntro: { color: COLORS.muted, fontSize: 13, marginBottom: 7 }, label: { color: COLORS.ink, fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 15 }, required: { color: COLORS.plum },
  input: { minHeight: 48, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, backgroundColor: COLORS.white, paddingHorizontal: 14, color: COLORS.ink, fontSize: 13 }, inputError: { borderColor: COLORS.red }, descriptionInput: { height: 92, paddingTop: 13 }, errorText: { color: COLORS.red, fontSize: 11, marginTop: 6, lineHeight: 15 },
  courseSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, selectorValue: { color: COLORS.ink, fontSize: 13 }, placeholder: { color: '#A5A1AF', fontSize: 13 }, chevron: { color: COLORS.muted, fontSize: 18 }, courseOptions: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, marginTop: 7, overflow: 'hidden' }, courseOption: { minHeight: 45, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.line }, courseOptionText: { color: COLORS.ink, fontSize: 13 }, courseOptionSelected: { color: COLORS.plum, fontWeight: '800' }, selectedCheck: { color: COLORS.plum, fontWeight: '900' },
  priceInputWrap: { minHeight: 48, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, currencyPrefix: { color: COLORS.plumDark, fontSize: 14, fontWeight: '800', marginRight: 10 }, priceInput: { flex: 1, color: COLORS.ink, fontSize: 13, paddingVertical: 10 },
  submitButton: { minHeight: 50, backgroundColor: COLORS.plum, borderRadius: 14, marginTop: 26, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, submitButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '800' }, submitArrow: { color: COLORS.white, fontSize: 19 }, requiredHint: { color: COLORS.muted, fontSize: 10, textAlign: 'center', marginTop: 12 },
  confirmBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(31, 24, 46, 0.42)', padding: 24 }, confirmCard: { width: '100%', maxWidth: 390, backgroundColor: COLORS.white, borderRadius: 20, padding: 22 }, confirmTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800' }, confirmBody: { color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 9 }, confirmDish: { color: COLORS.ink, fontWeight: '800' }, confirmActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 22 }, cancelButton: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 10 }, cancelButtonText: { color: COLORS.ink, fontSize: 12, fontWeight: '700' }, confirmDeleteButton: { backgroundColor: COLORS.red, borderRadius: 11, paddingHorizontal: 15, paddingVertical: 10 }, confirmDeleteText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
});

